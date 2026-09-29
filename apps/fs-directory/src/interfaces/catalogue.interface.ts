export interface IFeature {
  /** What this is called in plain English. */
  name: string;
  /** The task as it appears in a URL or the dashboard, for developers. */
  task?: string;
  /** What it does here, in plain English. */
  what: string;
  /** Whether this runs as a URL, a signed URL, or a Workflow. */
  shape: 'url' | 'signed' | 'workflow';
}

export interface IUseCase {
  slug: string;
  folder: string;
  /** The invented firm the demo is dressed as. */
  business: string;
  tagline: string;
  vertical: string;
  /** One line for the card. */
  summary: string;
  /** A paragraph for the detail page. */
  description: string;
  /** The problem it would otherwise cost you to solve. */
  instead: string;
  screenshot: string;
  port: number;
  stack: string[];
  features: IFeature[];
  /** Roles a visitor can explore, if it has more than one side. */
  roles: string[];
  status: 'mature' | 'built' | 'thin';
  /** Whether it stores anything beyond the file itself. */
  persistence: string;
  docs: { article: boolean; videoScript: boolean; readme: boolean };
}
