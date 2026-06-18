export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface HomepageSlider {
  id: number;
  imageUrl: string;
  altText: string | null;
  redirectUrl: string | null;
  displayOrder: number;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface HomepageSliderPayload {
  redirectUrl?: string;
  altText?: string;
  displayOrder?: number;
  isActive?: boolean;
}
