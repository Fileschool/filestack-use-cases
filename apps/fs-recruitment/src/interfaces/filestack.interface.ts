/** A file that lives in Filestack. */
export interface IStoredFile {
  url: string;
  handle: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt?: string;
}

/** Presets accepted by the enhance task. */
export type EnhancePreset =
  | 'auto'
  | 'vivid'
  | 'beautify'
  | 'beautify_plus'
  | 'fix_dark'
  | 'fix_noise'
  | 'fix_tint'
  | 'outdoor'
  | 'fireworks';

/** Tasks that reject an unsigned request and must be signed server side. */
export type ISignedTask =
  | { task: 'ocr' }
  | { task: 'envelope_ocr' }
  | { task: 'doc_detection'; coords?: boolean; preprocess?: boolean };

export interface IUpscaleOptions {
  noise?: 'none' | 'low' | 'medium' | 'high';
  upscale?: boolean;
}

/** One word, with the bounding box OCR returns alongside it. */
export interface IOcrWord {
  text?: string;
  bounding_box?: unknown;
}

export interface IOcrLine {
  text?: string;
  words?: IOcrWord[];
}

export interface IOcrTextArea {
  text?: string;
  lines?: IOcrLine[];
}

export interface IOcrResult {
  document?: { text_areas?: IOcrTextArea[] };
  text?: string;
  text_area_percentage?: number;
}

export interface IEnvelopeOcrResult {
  sender?: string;
  recipient_name?: string;
  recipient_address?: string;
}

/** Virus detection is a Workflows task, so this arrives by webhook. */
export interface IVirusVerdict {
  infected: boolean;
  infections_list: string[];
}
