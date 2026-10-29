# Labelled Fields, Not Text: A Digital Mailroom Built on Filestack's envelope_ocr

Scanning the post is easy. Working out who each item belongs to is the job.

That part stays manual in most mailrooms, and the reason is structural. The address block sits in a different place on every envelope, in a different typeface, sometimes handwritten, sometimes behind a window. Run general OCR over it and you get back a block of text containing a company name, a street, a postcode and a person, with nothing telling you which is which.

Building it yourself means an OCR engine, then a layout model or a pile of regular expressions to find the recipient line in that text, then a parser that breaks on the next envelope it has not seen. That is a project with no end date, and none of it is the mailroom.

This guide walks through **Redfern**, a virtual mailroom, and the thing worth stealing from it: **`envelope_ocr` returns the sender and recipient as named fields, so routing becomes a directory lookup instead of a parser.**

## What we're building

An operator scans a morning's post and uploads the batch. Each envelope is read, the recipient is matched against a staff list, and the item is routed to that person. Anything that cannot be matched is held for a supervisor rather than guessed at. The text on each scan is indexed so the archive is searchable.

The only part a person touches is the queue of items the machine was not sure about.

## Stack

| Layer                            | Tech                    |
| -------------------------------- | ----------------------- |
| Framework                        | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack               |
| Client state                     | Zustand                 |
| Styling                          | Tailwind v4             |
| Language                         | TypeScript              |

Processed items live in a persisted Zustand store, which is `localStorage` behind a hook, so the scanning view and the supervisor's "sorting floor" share state with no database. Logins are emulated. The staff directory is a five-person array. The file layer is the real thing.

## Step 1: Two keys

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
FILESTACK_APP_SECRET=your_app_secret_here
```

The public key handles uploads, which go from the browser straight to Filestack. The secret is there because `envelope_ocr`, `ocr` and `doc_detection` all **reject unsigned requests**. They need a policy signed with your app secret, so they cannot be built in the browser the way a `resize` URL can. The secret stays on the server and must never carry a `NEXT_PUBLIC_` prefix.

## Step 2: Upload the batch

A morning's post arrives as a batch, so the dropzone asks for one:

```tsx
// src/components/features/Mailroom.tsx
<Dropzone
  onFiles={(files) => void ingest(files)}
  accept={['image/*']}
  maxFiles={8}
  label="Add this morning's scans"
  hint="Select the whole batch at once"
/>
```

Behind it is the shared picker helper from this series, which wraps the File Picker in a promise and returns an array of trimmed file records. Every item in the batch is processed in parallel with `Promise.all`, and each one shows up in the list immediately in a `reading` state, so the operator sees the whole batch land before any result comes back.

## Step 3: Signing on the server

One API route holds the secret and returns finished URLs:

```ts
// src/app/api/filestack/sign/route.ts
const ALLOWED = /^(ocr|envelope_ocr|doc_detection(=[a-z_]+:(true|false)(,[a-z_]+:(true|false))*)?)$/;

const policy = JSON.stringify({
  expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  call: ['read', 'convert'],
  handle,
});

const encodedPolicy = Buffer.from(policy).toString('base64');
const signature = createHmac('sha256', secret).update(encodedPolicy).digest('hex');

const url = [CDN, `security=p:${encodedPolicy},s:${signature}`, ...tasks, handle].join('/');
```

A policy is base64 JSON and the signature is its HMAC-SHA256 under the secret. The security segment goes **in front of** the task chain.

Two details worth copying. The policy is scoped to a single `handle`, so a leaked URL is useless against any other file. And the route only signs tasks on its allowlist. Without that, you have built a signing oracle: anyone can post any chain and get it signed with your secret.

## Step 4: The task that does the work

```ts
const signed = await requestSignedUrl(file.handle, [signedTaskSegment({ task: 'envelope_ocr' })]);
const result = (await fetch(signed).then((r) => r.json())) as IEnvelopeOcrResult;
```

What comes back is not a paragraph. It is three named fields:

```ts
export interface IEnvelopeOcrResult {
  sender?: string;
  recipient_name?: string;
  recipient_address?: string;
}
```

That is the whole difference between this and general OCR. `recipient_name` is a property, so routing is a lookup against your directory rather than a hunt through text for something that looks like a person.

## Step 5: Index what was scanned

Each scan then goes through a second chain so it can be searched later:

```ts
const indexUrl = await requestSignedUrl(file.handle, [
  signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
  signedTaskSegment({ task: 'ocr' }),
]);
```

Which produces:

```
security=p:…,s:…/doc_detection=coords:false,preprocess:true/ocr/<handle>
```

`doc_detection` finds the page inside the photo, warps it flat and preprocesses it. With `coords:false` it returns the processed image, which `ocr` then reads. Order matters: a flattened page reads far better than a photograph of one.

`ocr` returns text areas, lines and words with bounding boxes, plus a flat `text` field. For a search index the flat field is what you want.

One honest note about the demo: both chains run on **the same uploaded image**. So "indexed contents" here is the text on the envelope scan, not on the letter inside. In a real mailroom the opened contents are a separate scan with its own handle, and that is the one that should go through `doc_detection` and `ocr`. The envelope only needs `envelope_ocr`.

## Where the machine stops and the supervisor starts

The interesting design decision in a mailroom is not the reading. It is where you draw the line between "routed automatically" and "held for a human", because every item on the wrong side of it is either a letter delivered to the wrong person or a supervisor doing work the machine could have done.

The app's matcher is two passes:

```ts
function matchRecipient(name?: string) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return (
    DIRECTORY.find((person) => lower.includes(person.name.toLowerCase())) ??
    DIRECTORY.find((person) =>
      person.name.split(' ').some((part) => part.length > 3 && lower.includes(part.toLowerCase())),
    ) ??
    null
  );
}
```

The first pass is an exact full-name match. The second is the one that matters, and it is looser than it looks. It splits each staff name into parts and matches on **any** part longer than three characters, which includes first names.

So an envelope addressed to "Daniel Price", someone who does not work here, routes straight to Daniel Whitfield in Legal. A letter to "Petra Holdings Ltd" goes to Petra Novak. Envelopes carry initials, married names and misspellings, so some fuzziness is right. But a mailroom's worst outcome is confident misdelivery, not an item in a queue, so the fuzziness should push items **towards** the supervisor, not away from them.

A better line:

- **Route automatically** on a full-name match, or a surname match that is unique in the directory.
- **Hold** on a first-name-only match, a surname shared by two people, or anything that looks like a company.
- **Show the reason** for every hold, so the supervisor can see what the machine was unsure about.

The labelled fields make this possible. With general OCR you could not even ask the question, because you would not know which words were the recipient.

## Errors that should be loud

The indexing step tries hard to be honest. If it fails, the item is flagged rather than silently treated as indexed:

```ts
} catch (indexError) {
  // Routing succeeded, but say so rather than pretending it indexed.
  console.error('Could not index the contents:', indexError);
  contents = undefined;
  indexFailed = true;
}
```

But only a thrown error lands in that `catch`. A `400` or `403` from the CDN does not throw from `fetch`. It goes down the `if (indexed.ok)` branch, skips it, and leaves `indexFailed` as `false`. So the most likely failure, a missing secret or a task not enabled on the plan, is exactly the one that goes unreported. Treat a non-`ok` response as a failure:

```ts
const indexed = await fetch(indexUrl);
if (!indexed.ok) throw new Error(`ocr returned ${indexed.status}`);
contents = ((await indexed.json()) as IOcrResult).text;
```

The same applies one level up. An envelope whose `envelope_ocr` call fails is shown as an error on screen but never recorded, so it never reaches the supervisor's sorting floor. On a real morning that is a letter that was scanned and then disappeared. Failed items belong in the held queue, with the error attached.

## Beyond the mailroom

| Surface                                     | Filestack feature                         |
| ------------------------------------------- | ----------------------------------------- |
| Returned mail and address correction        | `envelope_ocr`                            |
| Registered-office statutory post            | `envelope_ocr`, routed to the company secretary |
| Cheque and remittance capture               | `doc_detection`, `ocr`                    |
| Parcel and courier label sorting            | `ocr`                                     |
| Screening scanned attachments before release | `virus_detection` in a Workflow           |
| Running the chain once, on upload           | [Workflows](https://www.filestack.com/docs/workflows/) |

## Production checklist

- **Tighten the matcher.** No first-name-only routing. Route on unique surnames, hold everything else, and record why.
- **Match against a real directory** with an alias table for initials, maiden names and departed staff.
- **Treat a non-`ok` response as a failure** in both chains, and send failed items to the held queue instead of dropping them.
- **Index the contents, not the envelope.** Give the opened letter its own upload and run `doc_detection` and `ocr` on that.
- **Move the chain into a Workflow.** A batch of 400 envelopes should not be 800 signing requests and 800 fetches from one browser tab.
- **Downscale before `doc_detection`.** It has a maximum input size, and scanner output is large.
- **Keep the signing allowlist tight** and the TTL short.
- **Move items out of `localStorage`** and replace the emulated login, so staff only see post addressed to them.
- **Configure Security Policies**: origin lock, `image/*`, a size cap.

## Further reading

| Topic                                 | Link                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------- |
| File Picker configuration and sources | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/)               |
| Every transformation task             | [Processing API](https://www.filestack.com/docs/api/processing/)             |
| `envelope_ocr`, `ocr`, `doc_detection` | [Intelligence](https://www.filestack.com/docs/transformations/intelligence/) |
| Policies and signatures               | [Security](https://www.filestack.com/docs/security/)                         |
| Chaining processing on upload         | [Workflows](https://www.filestack.com/docs/workflows/)                       |

## Final thoughts

The interesting thing here is not that Filestack can read an envelope. It is that it gives the answer back **already labelled**.

- General OCR hands you a paragraph and leaves you to find the person in it.
- `envelope_ocr` hands you `recipient_name`.

That turns the hard part of a mailroom from parsing into a policy question: how sure do you need to be before a letter goes to someone without a human looking? That is a better question to spend your time on, and it is one you can only ask once the fields have names.

The general shape holds well beyond post: **when a task can return structure, take the structure, and spend the saved effort deciding what the machine is allowed to do on its own.**

Try the live demo or grab the source on GitHub.
