import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductDetailInteractive from './components/ProductDetailInteractive';
import { getProductDetailById, getRelatedProducts } from '@/service/public-product.service';

interface ProductDetailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: ProductDetailPageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!rawId) {
    return {
      title: 'Product Detail - JewelCraft',
      description: 'View product details and discover more from JewelCraft.',
    };
  }

  try {
    const product = await getProductDetailById(rawId);
    return {
      title: `${product.name} - JewelCraft`,
      description:
        product.description ||
        `View ${product.name} details, pricing, images, and available options at JewelCraft.`,
    };
  } catch {
    return {
      title: 'Product Detail - JewelCraft',
      description: 'View product details and discover more from JewelCraft.',
    };
  }
}

export default async function ProductDetailPage({ searchParams }: ProductDetailPageProps) {
  const params = await searchParams;
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!rawId) {
    notFound();
  }

  let product;
  let relatedProducts;

  try {
    [product, relatedProducts] = await Promise.all([
      getProductDetailById(rawId),
      getRelatedProducts(rawId, 8),
    ]);
  } catch {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    product.category
      ? {
          label: product.category.name,
          path: `/product-listing?category_id=${product.category.id}`,
        }
      : null,
    { label: product.name },
  ].filter(Boolean) as { label: string; path?: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={3} />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <ProductDetailInteractive product={product} relatedProducts={relatedProducts} />
        </div>
      </main>
    </div>
  );
}
