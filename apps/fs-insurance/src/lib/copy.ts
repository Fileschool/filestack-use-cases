export const BRAND = {
  name: 'Ardmore Mutual',
  legal: 'Ardmore Mutual Insurance Society',
  tagline: 'Insurance since 1923',
  nav: ['Home', 'Business', 'Claims', 'About the Society', 'Contact'],
  footer:
    'Ardmore Mutual Insurance Society. Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority.',

  hero: {
    eyebrow: 'A mutual, owned by its members',
    headline: 'Report it today. Photograph it as it is.',
    sub: 'Making a claim should not require good lighting, a scanner or a free afternoon. Send us what you have from your phone and we will do the tidying up before your claim reaches an assessor.',
    primaryCta: 'Start a claim',
    secondaryCta: 'Find your policy',
  },

  statsLabel: 'Claims performance, 2025',
  stats: [
    { value: '96.4%', label: 'Household claims paid' },
    { value: '3.2 days', label: 'Average time to first decision' },
    { value: '102 yrs', label: 'Paying claims without a shareholder' },
  ],

  services: {
    title: 'What we cover',
    items: [
      {
        title: 'Home and contents',
        body: 'Buildings, contents and accidental damage for owners and tenants, with escape of water settled in-house rather than referred out.',
      },
      {
        title: 'Small business',
        body: 'Premises, stock and business interruption for shops, workshops and practices with fewer than fifty employees.',
      },
      {
        title: 'Property owners',
        body: 'Cover for landlords of residential and mixed-use buildings, including periods between tenancies.',
      },
    ],
  },

  how: {
    title: 'Making a claim',
    steps: [
      {
        title: 'Send what you have',
        body: 'Photographs of the damage and a picture of your policy schedule. Taken on a phone, at whatever angle, in whatever light.',
      },
      {
        title: 'We prepare the file',
        body: 'Documents are straightened and read, your policy and claim numbers are pulled out automatically, and dark photographs are corrected so the damage is visible.',
      },
      {
        title: 'An assessor decides',
        body: 'A person reviews a file that is already complete and legible. That is why our first decision takes days rather than weeks.',
      },
    ],
  },

  proof: {
    quote:
      'I photographed a flooded kitchen at eleven at night on a phone with a cracked screen. Nobody asked me to send anything again. The decision came on the Thursday.',
    attribution: 'Member since 2011, Shropshire',
  },

  portal: {
    title: 'Start a claim',
    body: 'Upload a damage photograph or a picture of your policy schedule and watch the file being prepared for an assessor.',
    cta: 'Start a claim',
  },

  filestack: {
    features: 'Preparing claim files automatically',
    blurb:
      'Claim intake runs as a chain of Filestack tasks: screened, flattened, read and corrected before an assessor opens the file.',
    chain:
      'Screens each file for malware, straightens and reads photographed paperwork, and brightens dark damage photographs before an assessor opens the claim.',
  },

  admin: {
    navCta: 'Assessor login',
    referencePrefix: 'CLM',
    loginTitle: 'Claims assessors',
    loginIntro:
      'Sign in to the assessment desk to review claims prepared by the intake process.',
    accounts: [
      { name: 'Eleanor Prydderch', role: 'Senior Claims Assessor', email: 'e.prydderch@ardmoremutual.example' },
      { name: 'Sam Iheanacho', role: 'Claims Handler', email: 's.iheanacho@ardmoremutual.example' },
    ],
    title: 'Assessment desk',
    intro:
      'Claims that have been through intake. Paperwork is already straightened and read, photographs already corrected, so the first thing you do is decide.',
    empty: 'No claims yet. Report one from the member view and it will arrive here prepared.',
  },
};
