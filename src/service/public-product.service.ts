import {
  ProductFiltersResponse,
  ProductListingQuery,
  ProductListingResponse,
} from '@/app/(public)/product-listing/types';
import { ProductDetailResponse, RelatedProductResponse } from '@/app/(public)/product-detail/types';
import { HomepageFeaturedProduct } from '@/app/(public)/homepage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

type SearchParamValue = string | string[] | undefined;
type RawSearchParams = Record<string, SearchParamValue>;

function getSingleValue(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getPositiveInteger(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getSort(value: string | null): ProductListingQuery['sort'] {
  if (value === 'latest' || value === 'price_asc' || value === 'price_desc') {
    return value;
  }

  return 'popular';
}

export function normalizeProductListingQuery(searchParams: RawSearchParams): ProductListingQuery {
  return {
    page: getPositiveInteger(getSingleValue(searchParams.page), 1),
    limit: getPositiveInteger(getSingleValue(searchParams.limit), 12),
    sort: getSort(getSingleValue(searchParams.sort)),
    categoryId: getSingleValue(searchParams.category_id),
    brandId: getSingleValue(searchParams.brand_id),
    minPrice: getSingleValue(searchParams.min_price),
    maxPrice: getSingleValue(searchParams.max_price),
    q: getSingleValue(searchParams.q),
  };
}

function buildQueryString(query: ProductListingQuery) {
  const params = new URLSearchParams();

  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  params.set('sort', query.sort);

  if (query.categoryId) {
    params.set('category_id', query.categoryId);
  }

  if (query.brandId) {
    params.set('brand_id', query.brandId);
  }

  if (query.minPrice) {
    params.set('min_price', query.minPrice);
  }

  if (query.maxPrice) {
    params.set('max_price', query.maxPrice);
  }

  if (query.q) {
    params.set('q', query.q);
  }

  return params.toString();
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const rawJson = await response.json();
  // console.log(`[fetchJson API TRACE] path: ${path}`);
  // console.log(`[fetchJson API TRACE] raw response snippet:`, JSON.stringify(rawJson).slice(0, 150));

  // If the response represents direct array (backend hasn't fully updated or cache issue)
  if (Array.isArray(rawJson)) {
    console.warn(`[fetchJson API WARNING] Expected ApiResponse wrapper but got Array for path: ${path}. Using raw array.`);
    return rawJson as unknown as T;
  }

  const json = rawJson as ApiResponse<T>;
  return json.data !== undefined ? json.data : (rawJson as unknown as T);
}

export async function getProductListing(query: ProductListingQuery) {
  return fetchJson<ProductListingResponse>(`/products?${buildQueryString(query)}`);
}

export async function getProductFilters() {
  return fetchJson<ProductFiltersResponse>('/products/filters');
}

export async function getProductDetailById(id: string | number) {
  return fetchJson<ProductDetailResponse>(`/products/id/${id}`);
}

export async function getRelatedProducts(id: string | number, limit = 8) {
  return fetchJson<RelatedProductResponse[]>(`/products/id/${id}/related?limit=${limit}`);
}

export async function getFeaturedProducts(limit = 6) {
  return fetchJson<HomepageFeaturedProduct[]>(`/products/featured`);
}
