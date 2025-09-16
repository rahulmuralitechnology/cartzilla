export type SnippetStatus = "active" | "inactive";

export interface CodeSnippets {
  id: string;
  name: string;
  content: string;
  injectLocation: string;
  snippetProvider: string;
  snippetType: string;
  snippetStatus: SnippetStatus;
  createdAt?: string;
}
