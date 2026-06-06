export interface StaticContentItem {
  id: number;
  key: string;
  url: string;
  type: string | null;
  altText: string | null;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
