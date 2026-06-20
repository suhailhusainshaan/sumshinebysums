import { redirect, notFound } from 'next/navigation';

interface ProductDetailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Legacy redirect: /product-detail?id=44&variant=43 → /product-detail/44?variant=43
 */
export default async function ProductDetailLegacyPage({ searchParams }: ProductDetailPageProps) {
  const params = await searchParams;
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!rawId) {
    notFound();
  }

  const rawVariant = Array.isArray(params.variant) ? params.variant[0] : params.variant;
  const destination = rawVariant
    ? `/product-detail/${rawId}?variant=${rawVariant}`
    : `/product-detail/${rawId}`;

  redirect(destination);
}
