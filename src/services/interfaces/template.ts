import { TemplateType } from "./common";

export interface Template {
  id: string;
  userId?: string;
  name: string;
  repoDirName: string;
  templateType: TemplateType;
  latestVersion: string;
  currentVersion?: string;
  previewImage?: string;
  previewUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
