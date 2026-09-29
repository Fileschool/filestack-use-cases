export const BRAND = {
  name: 'Pemberton Hale',
  legal: 'Pemberton Hale LLP',
  tagline: 'Solicitors & Advisors',
  nav: ['Private Client', 'Corporate', 'Property', 'The Firm', 'Client Room'],
  footer:
    'Pemberton Hale LLP is authorised and regulated by the Solicitors Regulation Authority, number 604118.',

  hero: {
    eyebrow: 'Established 1946',
    headline: 'Your papers should not travel by email.',
    sub: 'Wills, completion statements and company filings leave this office through the client room, under a link issued to one person that stops working on its own. Nothing confidential sits in an inbox waiting to be forwarded.',
    primaryCta: 'Enter the client room',
    secondaryCta: 'Speak to the firm',
  },

  statsLabel: 'The firm',
  stats: [
    { value: '1946', label: 'Year of establishment' },
    { value: '4', label: 'Partners' },
    { value: '79 yrs', label: 'Advising families and owner-managed businesses' },
  ],

  services: {
    title: 'Where we are instructed',
    items: [
      {
        title: 'Private client',
        body: 'Wills, trusts, probate and lasting powers of attorney, usually for families we have acted for across more than one generation.',
      },
      {
        title: 'Corporate and commercial',
        body: 'Share sales, shareholder agreements and reorganisations for owner-managed businesses, working alongside your accountant.',
      },
      {
        title: 'Property',
        body: 'Residential and commercial conveyancing, landlord and tenant work, and the occasional matter involving a boundary and a hedge.',
      },
    ],
  },

  how: {
    title: 'How documents reach you',
    steps: [
      {
        title: 'We issue it to you by name',
        body: 'A link is created for one recipient with a set expiry. There is no permanent address to forward or leave in a thread.',
      },
      {
        title: 'You read it here',
        body: 'Documents open in the client room, marked with your name, so a copy taken elsewhere still shows where it came from.',
      },
      {
        title: 'You send yours back',
        body: 'Anything you upload is checked before it reaches a fee earner, which is a courtesy to both of us.',
      },
    ],
  },

  proof: {
    quote:
      'Our previous solicitors emailed a completion statement to an address I had not used in six years. Pemberton Hale sent a link that expired before I had finished reading it. I have never been so pleased to be inconvenienced.',
    attribution: 'Client, corporate sale, 2025',
  },

  portal: {
    title: 'Enter the client room',
    body: 'Issue a document to a named recipient and watch the link expire. This is the room our clients use.',
    cta: 'Enter the client room',
  },

  filestack: {
    features: 'Expiring links and watermarked documents',
    blurb:
      'Every link carries a short-lived Filestack security policy signed server side. Previews are watermarked and inbound files are screened before release.',
    chain:
      'Signs every link so it stops working after a set time, stamps previews with the name of the person they were issued to, and screens anything a client sends back.',
  },

  admin: {
    navCta: 'Fee earner login',
    referencePrefix: 'MAT',
    loginTitle: 'Members of the firm',
    loginIntro:
      'Sign in to the matter room to issue documents and review what clients have returned.',
    accounts: [
      { name: 'Alastair Pemberton', role: 'Senior Partner', email: 'a.pemberton@pembertonhale.example' },
      { name: 'Ruth Vasey', role: 'Associate, Private Client', email: 'r.vasey@pembertonhale.example' },
    ],
    title: 'Matter room',
    intro:
      'Documents issued to clients and files returned by them. Anything a client has uploaded is screened before it appears in this list.',
    empty: 'Nothing here yet. Issue a document from the client room and it will be recorded against the matter.',
  },
};
