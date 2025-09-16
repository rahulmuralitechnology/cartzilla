export interface ViewportPreset {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export interface IframeState {
  url: string;
  loading: boolean;
  error: string | null;
  viewport: {
    width: number;
    height: number;
  };
}
