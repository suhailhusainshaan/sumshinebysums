export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  parent: number | null;
}

export interface CategoryResponse {
  data: Category[];
  message: string;
  status: number;
}
