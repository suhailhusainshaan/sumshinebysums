import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductDetailInteractive from '../components/ProductDetailInteractive';
import { getProductDetailById, getRelatedProducts } from '@/service/public-product.service';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductDetailById(id);
    return {
      title: `${product.name} - Sumshine By Sums`,
      description:
        product.description ||
        `View ${product.name} details, pricing, images, and available options at Sumshine By Sums.`,
    };
  } catch {
    return {
      title: 'Product Detail - Sumshine By Sums',
      description: 'View product details and discover more from Sumshine By Sums.',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let product;
  let relatedProducts;

  try {
    [product, relatedProducts] = await Promise.all([
      getProductDetailById(id),
      getRelatedProducts(id, 8),
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
      <Header />

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
