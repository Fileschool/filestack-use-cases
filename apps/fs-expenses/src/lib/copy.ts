export const BRAND = {
  name: 'Marlow',
  legal: 'Marlow Financial Software',
  tagline: 'Spend & Expense Management',
  nav: ['Product', 'Cards', 'Integrations', 'Accountants', 'Pricing'],
  footer: 'Marlow Financial Software Ltd. Authorised as an EMD agent of Modulr FS Limited.',

  hero: {
    eyebrow: 'Expenses, finally finished on time',
    headline: 'The receipt is the expense claim.',
    sub: 'Your team photographs the receipt at the table and stops thinking about it. Marlow flattens it, reads it and codes it, so month end arrives with nothing outstanding and nothing guessed.',
    primaryCta: 'Try the capture demo',
    secondaryCta: 'Talk to sales',
  },

  statsLabel: 'Across Marlow customers',
  stats: [
    { value: '11 days', label: 'Faster month-end close' },
    { value: '96%', label: 'Receipts captured within 24 hours' },
    { value: '0', label: 'Spreadsheets in the approval chain' },
  ],

  services: {
    title: 'Built for the people who chase the receipts',
    items: [
      {
        title: 'Capture that survives real life',
        body: 'Creased, folded, photographed badly on a dark table. We straighten it, correct the colour and read it anyway, so nobody is asked to take it again.',
      },
      {
        title: 'Figures you can check',
        body: 'Every value we read is shown on the receipt where we found it. Your reviewer confirms a total at a glance instead of opening the original and hunting.',
      },
      {
        title: 'Ready for your ledger',
        body: 'Coded to your chart of accounts with the VAT split out, and posted to Xero, Sage or NetSuite without anyone rekeying a line.',
      },
    ],
  },

  how: {
    title: 'Three steps, one of which is yours',
    steps: [
      {
        title: 'Photograph it',
        body: 'Any angle, any light, straight from the phone. That is the entire task your team is asked to do.',
      },
      {
        title: 'We clean and read it',
        body: 'The receipt is found in the photo, flattened, colour corrected and read, in that order, because each step makes the next more accurate.',
      },
      {
        title: 'Finance approves',
        body: 'The claim arrives coded, with every figure highlighted on the image it came from. Approve or query in one click.',
      },
    ],
  },

  proof: {
    quote:
      'The thing that changed was not the scanning. It was being able to see the number highlighted on the receipt. Our approvals went from a morning to about twenty minutes.',
    attribution: 'Financial Controller, 240-person engineering consultancy',
  },

  portal: {
    title: 'Photograph a receipt and watch it work',
    body: 'Use the worst receipt you can find. Crumpled, angled, badly lit. See it flattened, corrected, read, and every figure marked where it was found.',
    cta: 'Try the capture demo',
  },

  filestack: {
    features: 'Reading receipts from photographs',
    blurb:
      'Receipts are flattened, colour corrected and read by the Filestack Processing and Intelligence APIs. Bounding boxes come straight from the OCR response.',
    chain:
      'Finds the receipt in the photograph and flattens it, corrects the lighting, then reads every figure and remembers where on the page it found each one.',
  },

  admin: {
    navCta: 'Finance login',
    referencePrefix: 'EXP',
    loginTitle: 'Finance team',
    loginIntro:
      'Sign in to review claims submitted by the business and approve them for the ledger.',
    accounts: [
      { name: 'Priya Raghunathan', role: 'Financial Controller', email: 'p.raghunathan@marlow.example' },
      { name: 'Tomas Lindqvist', role: 'Accounts Payable', email: 't.lindqvist@marlow.example' },
    ],
    title: 'Claims awaiting approval',
    intro:
      'Every receipt captured by the business, with the figures we read and where we read them. Approve or query without opening the original.',
    empty: 'No claims yet. Capture a receipt and it will arrive here for approval.',
  },
};
