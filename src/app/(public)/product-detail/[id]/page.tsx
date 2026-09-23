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
    const productUrl = `https://www.sumshinebysums.com/product-detail/${id}`;
    
    // Get the first available image or fallback
    const primaryImage = product.variants?.[0]?.images?.[0]?.url || 
                        product.images?.[0]?.url || 
                        'https://images.unsplash.com/photo-1599643477874-5c866f5c0c0b?q=80&w=1200&auto=format&fit=crop';
    
    const description = product.description || `View ${product.name} details, pricing, images, and available options at Sumshine By Sums.`;

    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        url: productUrl,
        type: 'website',
        images: [
          {
            url: primaryImage,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: [primaryImage],
      },
    };
  } catch {
    return {
      title: 'Product Detail',
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

  // Prepare JSON-LD for rich snippets
  const primaryImage = product.variants?.[0]?.images?.[0]?.url || product.images?.[0]?.url || '';
  const price = product.price || product.variants?.[0]?.price || 0;
  const sku = product.variants?.[0]?.sku || String(id);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: primaryImage ? [primaryImage] : [],
    description: product.description || `Buy ${product.name} at Sumshine By Sums.`,
    sku: sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Sumshine By Sums',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.sumshinebysums.com/product-detail/${id}`,
      priceCurrency: 'INR', // Defaulting to INR, change if multi-currency
      price: price,
      availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
