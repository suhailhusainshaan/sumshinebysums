export interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface StaticPageSummary {
  id: number;
  slug: string;
  title: string;
  isActive: boolean;
  updatedAt: string;
}

export interface PagePaginatedResponse {
  pages: StaticPageSummary[];
  total: number;
}
