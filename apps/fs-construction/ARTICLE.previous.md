# Review Architectural CAD Designs in the Browser: A Construction Portal Built on Filestack

*Posted on August 20, 2026 by Favour Onuoha*

Handling architectural blueprints and CAD designs is traditionally a desktop-software problem. An architect uploads a heavy `.dwg` file, a `.dxf` layout, or a massive 50-page construction PDF. To review it, the client or structural engineer has to download the file, ensure they have AutoCAD or a specialized viewer installed, and then navigate a complex UI just to read the foundations.

Doing this smoothly in a web application is where it gets expensive. You typically need a backend rendering service, specialized CAD-to-image conversion pipelines, a robust storage bucket for the multi-gigabyte files, and a CDN to serve the massive images so the client's browser doesn't crash. That's a huge rendering pipeline, and none of it is your core product feature.

This guide walks through **ApexCAD Construction**, a two-sided luxury construction portal where clients submit architectural drawings, and lead architects review them to generate structural cost estimates. The entire file handling and rendering pipeline is powered by a single URL.

## What we’re building

A client requests a quote by uploading their architectural designs (AutoCAD `.dwg`, `.dxf`, or `.pdf`). Lead architects open the submission and instantly get a fully rendered, responsive preview of the CAD file in their browser, powered by the Filestack Viewer. They can then review the structural load, determine material costs, and send a detailed structural estimate back to the client.

The massive CAD file is securely ingested, stored, and transformed without ever bogging down the developer's server.

## Stack

| Layer | Tech |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, React Server Components) |
| **Upload, storage, CDN, rendering** | Filestack |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS v4 |
| **Language** | TypeScript |

Logins are emulated: the sign-in screen lets you toggle between the Lead Architect and Client User to explore both sides of the platform. There are no passwords because this is a demo of the file workflow, not of authentication. Everything else is real.

Filestack covers the heavy lifting: ingesting massive CAD files straight from the browser (or from cloud drives), cloud storage, global CDN delivery, and rendering proprietary document types (like `.dwg`) natively in the browser via the Filestack Document Viewer. There is no custom CAD processing code in this repository.

## Step 1: Get your Filestack API key

Sign up at [filestack.com](https://www.filestack.com/), grab the key, and drop it in `.env.local`:

```env
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
```

`NEXT_PUBLIC_` exposes it to the browser, which is required: uploads go from the client's machine to Filestack's ingestion network directly, bypassing your server completely. In production, you lock this down with [Security Policies](https://www.filestack.com/docs/security/) — restricting allowed origins, MIME types, and setting maximum file sizes.

One helper earns its keep immediately:

```typescript
// src/lib/filestack.ts
export const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? "";
export function hasFilestackKey(): boolean {
  return FILESTACK_API_KEY.length > 0;
}
```

## Step 2: Uploading massive files with the File Picker

Clients in the construction industry don't always have the latest CAD file on their local hard drive. It might be sitting in a shared Google Drive folder, a Dropbox, or an email attachment. We use the [Filestack File Picker](https://www.filestack.com/docs/uploads/pickers/web/) to handle this gracefully.

```typescript
import * as filestack from 'filestack-js';

const client = filestack.init(FILESTACK_API_KEY);

const picker = client.picker({
  accept: ['application/pdf', '.dwg', '.dxf', 'image/*'],
  maxFiles: 5,
  fromSources: [
    'local_file_system',
    'url',
    'googledrive',
    'dropbox',
    'onedrive'
  ],
  onUploadDone: (response) => {
    // Files are securely in the cloud. Store their handles in your DB.
    const uploadedFiles = response.filesUploaded;
    saveToDatabase(uploadedFiles);
  }
});

picker.open();
```

Building an integration with Google Drive, OneDrive, and Dropbox to allow clients to pull 500MB `.dwg` files would take weeks of OAuth configuration and background worker setup. Here, it takes five strings in an array.

## Step 3: Rendering CAD files natively in the browser

This is the step that would otherwise require dedicated rendering servers and expensive CAD processing licenses.

Whatever the client handed in — be it a standard PDF or a proprietary `.dwg` — the Lead Architect needs to view it instantly. Filestack’s [Document Viewer](https://www.filestack.com/products/deliver-files/) handles this seamlessly by acting as an embedded iframe that processes and streams the document securely.

```typescript
// src/components/features/FilestackViewer.tsx
import { FC } from 'react';
import { FILESTACK_API_KEY } from '@/lib/filestack';

interface IFilestackViewerProps {
  fileHandle: string;
}

export const FilestackViewer: FC<IFilestackViewerProps> = ({ fileHandle }) => {
  // Construct the secure Filestack CDN preview URL
  const previewUrl = `https://cdn.filestackcontent.com/${FILESTACK_API_KEY}/preview/${fileHandle}`;

  return (
    <div className="w-full h-[600px] border border-gray-200 overflow-hidden bg-gray-50">
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Document Viewer"
      />
    </div>
  );
};
```

When the iframe loads, Filestack's processing engine takes over. It intercepts the CAD file or PDF, converts it into an optimized, vector-sharp web format, and serves it through their global CDN. The architect gets smooth zooming, panning, and multi-page navigation without downloading a single megabyte of the original file.

## Step 4: Generating thumbnails for the Dashboard

To make the dashboard look like a luxury portfolio (similar to SHVO), we need visual representations of the projects. Instead of asking the client to upload a separate "cover photo," we can extract a thumbnail directly from their submitted CAD file or PDF.

Filestack's Processing API does this on the fly:

```typescript
// src/lib/filestack.ts
const CDN = "https://cdn.filestackcontent.com";

/** 
 * Automatically generates a thumbnail from the first page of a PDF or CAD file 
 */
export function getThumbnailUrl(handle: string, size = 400): string {
  const tasks = [
    "output=format:png,page:1,density:72",
    `resize=width:${size},height:${size},fit:crop`
  ];
  return `${CDN}/${FILESTACK_API_KEY}/${tasks.join('/')}/${handle}`;
}
```

`output=format:png,page:1,density:72` instructs the CDN to rasterize the first page of the proprietary document. `resize=width:400,height:400,fit:crop` guarantees we get a perfectly squared image for our grid gallery. Filestack renders it on the first request, caches it at the edge, and serves it instantly forever after.

## Production checklist

When moving a workflow like this from a demo to production, keep these in mind:

1. **Authentication & Authorization**: Replace the emulated Zustand store with a real Auth provider (e.g., NextAuth, Clerk) to ensure only assigned architects can view a client's blueprints.
2. **Security Policies**: Configure [Security Policies](https://www.filestack.com/docs/security/) (origin lock, `accept` headers) and keep `FILESTACK_APP_SECRET` on your server. Generate policy signatures server-side before initiating uploads.
3. **Virus Scanning**: Construction files often come from large corporate networks. Add [Intelligence Virus Detection](https://www.filestack.com/docs/intelligence/) as a Workflow step to scan every blueprint *before* a lead architect opens it.
4. **Metadata Extraction**: Use Filestack to pull EXIF data or document metadata to auto-fill the project timeline forms.

## Final thoughts

The feature here — allowing a client to upload a massive AutoCAD blueprint, and allowing an architect to review it smoothly in a browser — typically requires a dedicated infrastructure team. With Filestack, it required:

1. `client.picker()` to ingest the file from anywhere.
2. An `<iframe>` pointing to `/preview/:handle` to view the proprietary CAD file.
3. A CDN URL with `/output=format:png/resize=width:400/` to generate dashboard thumbnails.

The general shape is worth adopting even if you never build a construction portal: **store handles, not files; render views as URLs.** You get massive file support, instant global delivery, and proprietary document rendering for free, because you offloaded the entire pipeline to the CDN.

Try the live demo in the repository or grab the source on GitHub to see the luxury construction aesthetic in action!

---

*Ready to get started?*
[Create an account now!](https://www.filestack.com/signup-start/)
