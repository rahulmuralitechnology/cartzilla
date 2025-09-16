import { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

export interface IBrandConfig {
  logo?: string | ReactNode;
  icon?: string | ReactNode;
  themeSwitch?: boolean;
  darkLogo?: string | ReactNode;
  name?: string;
  defaultTheme?: Theme;
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
  brandColor?: string;
}

export interface ThemeSchema {
  brand?: IBrandConfig;
  darkMode?: boolean;
}
