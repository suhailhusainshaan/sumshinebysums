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
