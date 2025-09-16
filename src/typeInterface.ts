export interface IInputParams {
  label: string;
  name: string;
  type: InputType;
  placeholder: string;
  description: string;
  options?: Array<{ label: string; value: string }>;
  id?: string;
  row?: number;
  defaultValue?: any;
  optional?: boolean;
}

export interface IInputs {
  [type: string]: any;
}
export interface IOutputs {
  [type: string]: any;
}

export interface IOutputAnchors {
  id: string;
  name: string;
  label: string;
  type: string;
}

export interface INodeData {
  id: string;
  name: string;
  label: string;
  version?: number;
  type: string;
  category: string;
  description: string;
  inputParams: IInputParams[];
  inputs: IInputs;
  outputs: IOutputs;
  outputAnchors: IOutputAnchors;
  inputAnchors: IOutputAnchors;
  selected: boolean;
  target: boolean;
  source: boolean;
}

export interface ICanvasNode {
  width?: number;
  height?: number;
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: "customNode";
  data: INodeData;
  selected?: boolean;
  positionAbsolute?: {
    x: number;
    y: number;
  };
  dragging?: boolean;
}

export type InputType = "text" | "textArea" | "options" | "switch" | "number" | "upload" | "output";

export interface IDefaultTemplate {
  id: number;
  templateId: string;
  createdAt: string;
  templateName: string;
  description: string;
  template: any;
}
