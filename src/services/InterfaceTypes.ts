export interface ISuccessRes {
  message?: string;
  success?: boolean;
  [type: string]: any;
}

export type ServerError = { error?: string; success?: boolean; [type: string]: any; message?: string };
