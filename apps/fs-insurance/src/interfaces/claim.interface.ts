import { IStoredFile } from './filestack.interface';

/** Where a claim has got to. The assessor moves it along. */
export type ClaimStatus =
  | 'reported'
  | 'in_assessment'
  | 'awaiting_member'
  | 'settled'
  | 'declined';

/** What went wrong. Insurers call this the peril. */
export type Peril =
  | 'escape_of_water'
  | 'fire'
  | 'storm'
  | 'theft'
  | 'accidental_damage'
  | 'flood'
  | 'subsidence';

export type CoverType = 'home_contents' | 'home_buildings' | 'small_business' | 'property_owners';

export interface IMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  policyNumber: string;
  coverType: CoverType;
  address: string;
  memberSince: string;
}

export interface IAssessor {
  id: string;
  name: string;
  role: string;
  email: string;
}

/** A file attached to a claim, plus whatever intake worked out about it. */
export interface IClaimFile extends IStoredFile {
  id: string;
  claimId: string;
  kind: 'damage_photo' | 'document';
  /** What the intake chain pulled off it, if anything. */
  extractedText?: string;
  extractedReference?: string;
  /** Whether the intake chain has run. */
  processed: boolean;
  scanResult: 'pending' | 'clean' | 'infected';
}

export interface IClaim {
  id: string;
  reference: string;
  memberId: string;
  peril: Peril;
  incidentDate: string;
  description: string;
  estimatedValue: number | null;
  status: ClaimStatus;
  assessorId: string | null;
  assessorNotes: string;
  settlementAmount: number | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** A claim with everything the desk needs to show it in a list. */
export interface IClaimSummary extends IClaim {
  member: IMember;
  assessor: IAssessor | null;
  fileCount: number;
  coverPhotoHandle: string | null;
}

/** A claim with everything the desk needs to decide it. */
export interface IClaimDetail extends IClaimSummary {
  files: IClaimFile[];
}

export interface IClaimFilters {
  status?: ClaimStatus | 'all';
  peril?: Peril | 'all';
  search?: string;
}

export interface IReportClaimInput {
  policyNumber: string;
  peril: Peril;
  incidentDate: string;
  description: string;
  estimatedValue: number | null;
  files: {
    handle: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  }[];
}

export interface IAssessmentInput {
  claimId: string;
  status: ClaimStatus;
  settlementAmount: number | null;
  assessorNotes: string;
}

export const PERIL_LABELS: Record<Peril, string> = {
  escape_of_water: 'Escape of water',
  fire: 'Fire',
  storm: 'Storm',
  theft: 'Theft',
  accidental_damage: 'Accidental damage',
  flood: 'Flood',
  subsidence: 'Subsidence',
};

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  reported: 'Reported',
  in_assessment: 'In assessment',
  awaiting_member: 'Awaiting member',
  settled: 'Settled',
  declined: 'Declined',
};

export const COVER_LABELS: Record<CoverType, string> = {
  home_contents: 'Home contents',
  home_buildings: 'Home buildings',
  small_business: 'Small business',
  property_owners: 'Property owners',
};
