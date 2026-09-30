import { IBaseEntity } from './common.interface';
import { IStoredFile } from './filestack.interface';

export type QuoteStatus = 'pending' | 'in_review' | 'quote_sent' | 'approved' | 'declined';
export type ProjectType = 'commercial' | 'residential' | 'industrial' | 'infrastructure' | 'renovation';

export interface ICostBreakdownItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export interface IQuoteResponse {
  estimatedCost: number;
  estimatedTimelineWeeks: number;
  architectNotes: string;
  costBreakdown: ICostBreakdownItem[];
  respondedAt: string;
  respondedBy: string;
}

export interface IQuoteRequest extends IBaseEntity {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  projectName: string;
  projectType: ProjectType;
  squareFootage: number;
  location: string;
  targetBudget: number;
  desiredTimeline: string;
  description: string;
  designFiles: IStoredFile[];
  status: QuoteStatus;
  adminNotes?: string;
  response?: IQuoteResponse;
}

export interface ICreateQuoteDTO {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  projectName: string;
  projectType: ProjectType;
  squareFootage: number;
  location: string;
  targetBudget: number;
  desiredTimeline: string;
  description: string;
  designFiles: IStoredFile[];
}

export interface IUpdateQuoteDTO extends Partial<Omit<IQuoteRequest, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface IQuoteFilterParams {
  status?: QuoteStatus | 'all';
  projectType?: ProjectType | 'all';
  search?: string;
}
