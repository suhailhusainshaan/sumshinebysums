import type { Metadata } from 'next';
import ProductListingInteractive from './components/ProductListingInteractive';
import {
  getProductFilters,
  getProductListing,
  normalizeProductListingQuery,
} from '@/service/public-product.service';
import { ProductFiltersResponse, ProductListingResponse } from './types';

export const metadata: Metadata = {
  title: 'Shop All Products - JewelCraft',
  description:
    'Browse our complete collection of elegant artificial jewelry including necklaces, earrings, bracelets, rings, and sets. Filter by category, material, color, and price to find your perfect piece.',
};

interface ProductListingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const emptyFilters: ProductFiltersResponse = {
  categories: [],
  brands: [],
  priceRange: { min: 0, max: 0 },
};

const emptyProducts: ProductListingResponse = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  size: 12,
  number: 0,
  first: true,
  last: true,
};

export default async function ProductListingPage({ searchParams }: ProductListingPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeProductListingQuery(resolvedSearchParams);

  let filters = emptyFilters;
  let products = emptyProducts;
  let errorMessage: string | null = null;

  try {
    [filters, products] = await Promise.all([getProductFilters(), getProductListing(query)]);
  } catch {
    errorMessage = 'We could not load products right now. Please try again in a moment.';
  }

  return (
    <ProductListingInteractive
      filters={filters}
      products={products}
      query={query}
      errorMessage={errorMessage}
    />
  );
}
