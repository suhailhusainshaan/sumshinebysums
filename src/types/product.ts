export interface Product {
  name: string;
  slug: string;
  description: string;
  brandId: number;
  categoryId: number;
  features: {
    material: string;
    finish: string;
    hypoallergenic: boolean;
  };
  specifications: {
    diameter: string;
    thickness: string;
    clasp_type: string;
  };
  sku: string;
  variantName: string;
  price: number;
  compareAtPrice: number;
  costPrice: number;
  stockQuantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  imageUrl: string;
  altText: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
