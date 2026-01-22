
export interface InspirationResult {
  title: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING_TEXT = 'LOADING_TEXT',
  LOADING_IMAGE = 'LOADING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
