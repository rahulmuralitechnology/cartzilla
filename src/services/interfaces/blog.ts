export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  isPublished: boolean;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string | null;
  storeId?: string;
  userId?: string;
}
