export const BRAND = {
  name: 'Redfern',
  legal: 'Redfern Mail Services Ltd',
  tagline: 'Mail & Document Services',
  nav: ['Services', 'Sectors', 'Compliance', 'Pricing', 'Contact'],
  footer: 'Registered in England 3841027. Unit 4, Colville Works, Leeds LS11 9PD.',

  hero: {
    eyebrow: 'Serving 400 businesses since 1998',
    headline: 'Your post, opened and on the right desk by ten.',
    sub: 'We take the post room off your floor plan. Everything addressed to you is received, scanned, routed to the named recipient and indexed the same morning, wherever your people are working.',
    primaryCta: 'Open the mailroom',
    secondaryCta: 'Book a walkthrough',
  },

  statsLabel: 'Last twelve months',
  stats: [
    { value: '1.4m', label: 'Items handled' },
    { value: '99.2%', label: 'Routed without human sorting' },
    { value: '< 4 hrs', label: 'Average receipt to inbox' },
  ],

  services: {
    title: 'What we take off your hands',
    items: [
      {
        title: 'Registered address',
        body: 'Use our address on Companies House and your letterhead. Statutory mail is separated on arrival and flagged to your company secretary the same day.',
      },
      {
        title: 'Scan and route',
        body: 'Every envelope is read and matched to a named recipient. They get the scan in their inbox; you get an audit trail of who received what and when.',
      },
      {
        title: 'Archive and retrieval',
        body: 'Correspondence is indexed and searchable for seven years. Ask for anything by sender, date or reference and have it back the same hour.',
      },
    ],
  },

  how: {
    title: 'How a letter reaches your team',
    steps: [
      {
        title: 'It arrives here',
        body: 'Post is received at our Leeds facility, sorted by client and photographed unopened for your records.',
      },
      {
        title: 'We read the envelope',
        body: 'Sender and recipient are lifted off the envelope automatically and checked against your staff list. No one retypes an address.',
      },
      {
        title: 'It lands in the right inbox',
        body: 'Your colleague gets the scan. Anything we cannot match goes to a supervised queue rather than a guess.',
      },
    ],
  },

  proof: {
    quote:
      'We closed the post room when we went hybrid and assumed we would lose things. Two years on, we find documents faster than we did when they were in a filing cabinet forty feet away.',
    attribution: 'Practice Manager, veterinary group with eleven sites',
  },

  portal: {
    title: 'See the mailroom working',
    body: 'Open the client view, add a batch of scanned envelopes, and watch each one get read and routed the way your morning post would be.',
    cta: 'Open the mailroom',
  },

  filestack: {
    features: 'Reading post and indexing scans',
    blurb:
      'Envelope reading, scan clean-up and full-text indexing are powered by the Filestack Processing and Intelligence APIs. This application contains no OCR code.',
    chain:
      'Reads the sender and recipient straight off each envelope, straightens crooked scans, and turns the contents into text you can search.',
  },

  admin: {
    navCta: 'Staff login',
    referencePrefix: 'RDF',
    loginTitle: 'Mailroom staff',
    loginIntro:
      'Sign in to the sorting floor to see today’s batch and anything held for review.',
    accounts: [
      { name: 'Marie Ancelin', role: 'Mailroom Supervisor', email: 'm.ancelin@redfern.example' },
      { name: 'Owen Brathwaite', role: 'Scanning Operator', email: 'o.brathwaite@redfern.example' },
    ],
    title: 'Sorting floor',
    intro:
      'Everything scanned today, with the recipient we matched it to. Items we could not match are held here rather than guessed at.',
    empty: 'Nothing scanned yet. Add a batch from the mailroom view and it will appear here.',
  },
};
