export interface HomepageFeaturedProduct {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  active: boolean;
  featured: boolean;
  published: boolean;
}

export interface HomepageCategory {
  id: number;
  parentId?: number | null;
  parent?: number | { id: number } | null;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder?: number | null;
  active?: boolean;
  isActive?: boolean;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageHeroMediaAsset {
  id: number;
  key: string;
  url: string;
  type: string | null;
  altText: string | null;
  metadata?: Record<string, unknown> | null;
  active: boolean;
}

export interface HomepageSlider {
  id: number;
  imageUrl: string;
  altText: string;
  redirectUrl: string | null;
  displayOrder: number;
}
