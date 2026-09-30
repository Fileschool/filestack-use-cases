export interface IStoredFile {
  url: string;
  handle: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadDate?: string;
}

export type ViewFilterMode = 'normal' | 'blueprint' | 'grayscale' | 'contrast';

export interface ITransformOptions {
  width?: number;
  height?: number;
  fit?: 'clip' | 'crop' | 'scale' | 'max';
  rotate?: number;
  filter?: ViewFilterMode;
  format?: 'png' | 'jpg' | 'pdf';
  page?: number;
}

export interface IFileViewerProps {
  file: IStoredFile;
  className?: string;
  showControls?: boolean;
}
