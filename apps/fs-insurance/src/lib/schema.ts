/**
 * Schema and seed data for the claims desk.
 *
 * The seed matters as much as the schema: an assessment desk with nothing on it
 * tells you nothing, so the app opens with a week of realistic work already in
 * the queue.
 */
import { CLAIM_MEDIA } from './media';

export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS members (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT NOT NULL DEFAULT '',
    policy_number TEXT NOT NULL UNIQUE,
    cover_type    TEXT NOT NULL,
    address       TEXT NOT NULL DEFAULT '',
    member_since  TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS assessors (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    role  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`,

  `CREATE TABLE IF NOT EXISTS claims (
    id                TEXT PRIMARY KEY,
    reference         TEXT NOT NULL UNIQUE,
    member_id         TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    peril             TEXT NOT NULL,
    incident_date     TEXT NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    estimated_value   REAL,
    status            TEXT NOT NULL DEFAULT 'reported',
    assessor_id       TEXT REFERENCES assessors(id) ON DELETE SET NULL,
    assessor_notes    TEXT NOT NULL DEFAULT '',
    settlement_amount REAL,
    decided_at        TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  // Each file carries what intake worked out about it, so the assessor can see
  // why a policy number is on screen without re-running anything.
  `CREATE TABLE IF NOT EXISTS claim_files (
    id                  TEXT PRIMARY KEY,
    claim_id            TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    kind                TEXT NOT NULL CHECK (kind IN ('damage_photo', 'document')),
    handle              TEXT NOT NULL,
    url                 TEXT NOT NULL,
    filename            TEXT NOT NULL,
    mimetype            TEXT NOT NULL,
    size                INTEGER NOT NULL DEFAULT 0,
    extracted_text      TEXT NOT NULL DEFAULT '',
    extracted_reference TEXT NOT NULL DEFAULT '',
    processed           INTEGER NOT NULL DEFAULT 0,
    scan_result         TEXT NOT NULL DEFAULT 'pending',
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status)`,
  `CREATE INDEX IF NOT EXISTS idx_claims_member ON claims(member_id)`,
  `CREATE INDEX IF NOT EXISTS idx_claim_files_claim ON claim_files(claim_id)`,
];

/** ISO date `days` before today, so seeded dates always look current. */
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function stamp(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

const q = (value: string) => `'${value.replace(/'/g, "''")}'`;

const MEMBERS = [
  ['mem_arkwright', 'Josephine Arkwright', 'j.arkwright@example.com', '07700 900418', 'AM-4471-22', 'home_buildings', '14 Wetherby Rise, Harrogate HG2 8PT', '2011-04-02'],
  ['mem_oyelaran', 'Tunde Oyelaran', 't.oyelaran@example.com', '07700 900233', 'AM-6620-19', 'home_contents', 'Flat 6, Carlow Court, Bristol BS1 4RN', '2019-09-11'],
  ['mem_dunleavy', 'Marie Dunleavy', 'm.dunleavy@example.com', '07700 900771', 'AM-3318-24', 'small_business', 'Dunleavy Bakehouse, 3 Mill Street, Kendal LA9 4DN', '2024-01-30'],
  ['mem_whitcombe', 'Peter Whitcombe', 'p.whitcombe@example.com', '07700 900654', 'AM-1902-08', 'property_owners', '22a Erskine Terrace, Glasgow G12 8RS', '2008-06-19'],
  ['mem_nakamura', 'Aiko Nakamura', 'a.nakamura@example.com', '07700 900302', 'AM-7745-21', 'home_contents', '9 Priory Gardens, Norwich NR1 3QF', '2021-11-05'],
];

const ASSESSORS = [
  ['asr_prydderch', 'Eleanor Prydderch', 'Senior Claims Assessor', 'e.prydderch@ardmoremutual.example'],
  ['asr_iheanacho', 'Sam Iheanacho', 'Claims Handler', 's.iheanacho@ardmoremutual.example'],
];

type SeedClaim = {
  id: string;
  ref: string;
  member: string;
  peril: string;
  incident: number;
  description: string;
  estimate: number | null;
  status: string;
  assessor: string | null;
  notes: string;
  settlement: number | null;
  decided: number | null;
  created: number;
  files: {
    kind: 'damage_photo' | 'document';
    handle: string;
    filename: string;
    mimetype: string;
    size: number;
    text?: string;
    reference?: string;
  }[];
};

const CLAIMS: SeedClaim[] = [
  {
    id: 'clm_8841', ref: 'CLM-8841', member: 'mem_dunleavy', peril: 'escape_of_water', incident: 3,
    description:
      'Mains feed to the proving room failed overnight. Water across the bakery floor, two mixers and a dough retarder affected. Trading suspended since Tuesday.',
    estimate: 18400, status: 'in_assessment', assessor: 'asr_prydderch',
    notes: 'Loss adjuster booked for Thursday. Business interruption likely to run to three weeks.',
    settlement: null, decided: null, created: 3,
    files: [
      { kind: 'damage_photo', handle: CLAIM_MEDIA.repair, filename: 'mixer-damage.jpg', mimetype: 'image/jpeg', size: 1_840_221 },
      { kind: 'document', handle: CLAIM_MEDIA.paperwork, filename: 'policy-schedule.jpg', mimetype: 'image/jpeg', size: 942_118,
        text: 'ARDMORE MUTUAL INSURANCE SOCIETY\nSmall Business Policy Schedule\nPolicy number AM-3318-24\nInsured: Dunleavy Bakehouse\nBuildings and contents, business interruption included',
        reference: 'AM-3318-24' },
    ],
  },
  {
    id: 'clm_8839', ref: 'CLM-8839', member: 'mem_arkwright', peril: 'storm', incident: 5,
    description:
      'Ridge tiles lifted in Storm Vaughan and came down on the conservatory roof. Two panels cracked, gutter pulled away from the fascia.',
    estimate: 4250, status: 'reported', assessor: null, notes: '', settlement: null, decided: null, created: 4,
    files: [
      { kind: 'damage_photo', handle: CLAIM_MEDIA.property, filename: 'roof-and-conservatory.jpg', mimetype: 'image/jpeg', size: 2_210_884 },
    ],
  },
  {
    id: 'clm_8836', ref: 'CLM-8836', member: 'mem_oyelaran', peril: 'theft', incident: 9,
    description:
      'Forced entry through the kitchen window while away. Laptop, camera and a bicycle taken. Crime reference from Avon and Somerset supplied.',
    estimate: 3100, status: 'settled', assessor: 'asr_iheanacho',
    notes: 'Receipts provided for laptop and camera. Bicycle settled at market value. Member content with the outcome.',
    settlement: 2840, decided: 2, created: 9,
    files: [
      { kind: 'document', handle: CLAIM_MEDIA.paperwork, filename: 'receipts-and-crime-ref.jpg', mimetype: 'image/jpeg', size: 812_440,
        text: 'Crime reference 5224/119081/25\nPolicy number AM-6620-19\nItems: laptop, camera body, bicycle',
        reference: 'AM-6620-19' },
    ],
  },
  {
    id: 'clm_8830', ref: 'CLM-8830', member: 'mem_whitcombe', peril: 'subsidence', incident: 34,
    description:
      'Stepped cracking to the rear elevation of the let property, worsening since spring. Tenant reports doors binding on the ground floor.',
    estimate: 27500, status: 'awaiting_member', assessor: 'asr_prydderch',
    notes: 'Structural engineer instructed. Awaiting drainage survey from the member before we can proceed to a schedule of works.',
    settlement: null, decided: null, created: 30,
    files: [
      { kind: 'document', handle: CLAIM_MEDIA.survey, filename: 'engineer-drawing.jpg', mimetype: 'image/jpeg', size: 1_402_009,
        text: 'Structural appraisal, rear elevation\nCrack widths 3mm to 8mm, stepped, following mortar course\nRecommend drainage investigation before underpinning is considered',
        reference: 'AM-1902-08' },
      { kind: 'damage_photo', handle: CLAIM_MEDIA.property, filename: 'rear-elevation.jpg', mimetype: 'image/jpeg', size: 1_980_113 },
    ],
  },
  {
    id: 'clm_8828', ref: 'CLM-8828', member: 'mem_nakamura', peril: 'accidental_damage', incident: 12,
    description:
      'Bookcase came away from the wall and went through the plasterwork. Damage to the wall and to a framed print underneath.',
    estimate: 680, status: 'settled', assessor: 'asr_iheanacho',
    notes: 'Straightforward. Settled on estimate from the member’s decorator less the £150 excess.',
    settlement: 530, decided: 6, created: 12,
    files: [
      { kind: 'damage_photo', handle: CLAIM_MEDIA.repair, filename: 'wall-damage.jpg', mimetype: 'image/jpeg', size: 1_120_664 },
    ],
  },
  {
    id: 'clm_8824', ref: 'CLM-8824', member: 'mem_oyelaran', peril: 'escape_of_water', incident: 21,
    description:
      'Washing machine hose split behind the unit. Water under the flooring in the kitchen and into the hallway.',
    estimate: 5900, status: 'in_assessment', assessor: 'asr_iheanacho',
    notes: 'Drying equipment on site. Flooring likely a total loss; waiting on the restoration report.',
    settlement: null, decided: null, created: 20,
    files: [
      { kind: 'damage_photo', handle: CLAIM_MEDIA.repair, filename: 'kitchen-floor.jpg', mimetype: 'image/jpeg', size: 1_559_212 },
      { kind: 'document', handle: CLAIM_MEDIA.paperwork, filename: 'plumber-invoice.jpg', mimetype: 'image/jpeg', size: 688_301,
        text: 'Emergency call out, hose replacement\nPolicy number AM-6620-19\nTotal including VAT £214.80',
        reference: 'AM-6620-19' },
    ],
  },
  {
    id: 'clm_8819', ref: 'CLM-8819', member: 'mem_arkwright', peril: 'fire', incident: 48,
    description:
      'Tumble dryer overheated in the utility room. Smoke damage through the ground floor, scorching to the utility ceiling.',
    estimate: 12250, status: 'declined', assessor: 'asr_prydderch',
    notes:
      'Appliance was subject to a manufacturer recall issued in 2023 and had not been remediated. Declined under the maintenance exclusion. Member advised of the appeals process and of a possible claim against the manufacturer.',
    settlement: null, decided: 38, created: 45,
    files: [
      { kind: 'document', handle: CLAIM_MEDIA.paperwork, filename: 'recall-notice.jpg', mimetype: 'image/jpeg', size: 733_998,
        text: 'Product safety recall notice\nModel affected, serial range includes unit in question\nPolicy number AM-4471-22',
        reference: 'AM-4471-22' },
    ],
  },
  {
    id: 'clm_8815', ref: 'CLM-8815', member: 'mem_nakamura', peril: 'flood', incident: 62,
    description:
      'Surface water entered the ground floor after the Wensum burst its banks. Carpets, skirting and the bottom of the kitchen units affected.',
    estimate: 21800, status: 'settled', assessor: 'asr_prydderch',
    notes: 'Settled in two instalments, alternative accommodation for five weeks included. Member has since had flood resilience work done.',
    settlement: 20450, decided: 20, created: 60,
    files: [
      { kind: 'damage_photo', handle: CLAIM_MEDIA.property, filename: 'ground-floor.jpg', mimetype: 'image/jpeg', size: 2_402_771 },
      { kind: 'document', handle: CLAIM_MEDIA.survey, filename: 'restoration-schedule.jpg', mimetype: 'image/jpeg', size: 1_204_556,
        text: 'Restoration schedule of works\nStrip and replace flooring, replaster to 1.2m, replace base units\nPolicy number AM-7745-21',
        reference: 'AM-7745-21' },
    ],
  },
];

function claimStatements(): string[] {
  const out: string[] = [];

  for (const c of CLAIMS) {
    out.push(
      `INSERT INTO claims (id, reference, member_id, peril, incident_date, description, estimated_value,
         status, assessor_id, assessor_notes, settlement_amount, decided_at, created_at, updated_at)
       VALUES (${q(c.id)}, ${q(c.ref)}, ${q(c.member)}, ${q(c.peril)}, ${q(daysAgo(c.incident))},
         ${q(c.description)}, ${c.estimate ?? 'NULL'}, ${q(c.status)},
         ${c.assessor ? q(c.assessor) : 'NULL'}, ${q(c.notes)},
         ${c.settlement ?? 'NULL'}, ${c.decided === null ? 'NULL' : q(stamp(c.decided))},
         ${q(stamp(c.created))}, ${q(stamp(c.decided ?? c.created))})`,
    );

    c.files.forEach((f, index) => {
      out.push(
        `INSERT INTO claim_files (id, claim_id, kind, handle, url, filename, mimetype, size,
           extracted_text, extracted_reference, processed, scan_result, created_at)
         VALUES (${q(`${c.id}_f${index}`)}, ${q(c.id)}, ${q(f.kind)}, ${q(f.handle)},
           ${q(`https://cdn.filestackcontent.com/${f.handle}`)}, ${q(f.filename)}, ${q(f.mimetype)}, ${f.size},
           ${q(f.text ?? '')}, ${q(f.reference ?? '')}, 1, 'clean', ${q(stamp(c.created))})`,
      );
    });
  }

  return out;
}

export const SEED_STATEMENTS: string[] = [
  ...MEMBERS.map(
    (m) =>
      `INSERT INTO members (id, name, email, phone, policy_number, cover_type, address, member_since)
       VALUES (${m.map(q).join(', ')})`,
  ),
  ...ASSESSORS.map(
    (a) => `INSERT INTO assessors (id, name, role, email) VALUES (${a.map(q).join(', ')})`,
  ),
  ...claimStatements(),
];
