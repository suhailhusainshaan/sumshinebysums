export interface FaqCategory {
  slug: string;
  label: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Faq {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqPaginatedResponse {
  faqs: Faq[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
