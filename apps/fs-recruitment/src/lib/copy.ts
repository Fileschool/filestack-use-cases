export const BRAND = {
  name: 'Hollis',
  legal: 'Hollis Talent Operations',
  tagline: 'Applicant Tracking',
  nav: ['Product', 'Security', 'Integrations', 'Customers', 'Pricing'],
  footer: 'Hollis Talent Operations. ISO 27001 certified. Data held in the EU.',

  hero: {
    eyebrow: 'Trusted by 900 hiring teams',
    headline: 'Every application is a file from a stranger.',
    sub: 'Hollis screens every attachment before a recruiter can open it, renders it in the browser so nothing is downloaded, and makes the whole pipeline searchable. Hiring stops being your softest attack surface.',
    primaryCta: 'Open the pipeline',
    secondaryCta: 'See security docs',
  },

  statsLabel: 'Platform, last quarter',
  stats: [
    { value: '2.1m', label: 'Attachments screened' },
    { value: '1,840', label: 'Malicious files blocked' },
    { value: '0', label: 'Files downloaded to reviewer machines' },
  ],

  services: {
    title: 'Hiring software that assumes the worst about attachments',
    items: [
      {
        title: 'Screened before it is clickable',
        body: 'Every CV and portfolio is scanned on arrival. Until the result comes back, the attachment stays locked. A recruiter cannot open something nobody has checked.',
      },
      {
        title: 'Read without downloading',
        body: 'Applications render in the browser. Nothing is written to your recruiters&rsquo; machines, which removes the step every attachment-borne attack depends on.',
      },
      {
        title: 'Searchable, including the scans',
        body: 'We extract the text from every application, so searching for a qualification finds the candidate who sent a photographed CV as well as the one who sent a clean PDF.',
      },
    ],
  },

  how: {
    title: 'What happens when someone applies',
    steps: [
      {
        title: 'They upload',
        body: 'From their machine, a Drive folder or Dropbox, because that is where CVs actually live.',
      },
      {
        title: 'We screen it',
        body: 'The file is scanned in storage before anyone sees it. Clean files unlock. Infected files are quarantined and your security team is told.',
      },
      {
        title: 'Your team reviews',
        body: 'The CV opens in the browser, the text is indexed, and the candidate moves through your pipeline.',
      },
    ],
  },

  proof: {
    quote:
      'Our penetration test flagged the recruitment inbox two years running. After Hollis it came back clean, and honestly the search is the bit the team actually talks about.',
    attribution: 'Head of IT, financial services group',
  },

  portal: {
    title: 'Upload a CV and watch it stay locked',
    body: 'Add an application to the pipeline. The attachment will not open until screening reports back, then it renders in the browser with the text extracted.',
    cta: 'Open the pipeline',
  },

  filestack: {
    features: 'Screening and reading attachments',
    blurb:
      'Attachments are screened by the Filestack virus detection task in a Workflow, previewed through the hosted document viewer and indexed with OCR.',
    chain:
      'Scans every attachment for malware before anyone can open it, displays it in the browser without downloading it, and extracts the text so applications are searchable.',
  },

  admin: {
    navCta: 'Recruiter login',
    referencePrefix: 'APP',
    loginTitle: 'Hiring team',
    loginIntro:
      'Sign in to the pipeline to review applications that have cleared screening.',
    accounts: [
      { name: 'Nadia Okonkwo', role: 'Head of Talent', email: 'n.okonkwo@hollis.example' },
      { name: 'Greg Mulvaney', role: 'Technical Recruiter', email: 'g.mulvaney@hollis.example' },
    ],
    title: 'Application pipeline',
    intro:
      'Applications that have been screened and indexed. Attachments that have not cleared are not shown here at all.',
    empty: 'No applications yet. Submit one from the candidate view and it will appear once screened.',
  },
};
