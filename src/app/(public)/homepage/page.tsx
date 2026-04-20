import type { Metadata } from 'next';
import HomepageInteractive from './components/HomepageInteractive';
import { getFeaturedProducts, getProductListing } from '@/service/public-product.service';
import { HomepageFeaturedProduct } from './types';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

// Force this page to always re-render on the server (bypass Next.js full-route cache)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JewelCraft - Elegant Artificial Jewelry | Premium Quality Designs',
  description:
    'Discover exquisite handcrafted artificial jewelry at JewelCraft. Shop necklaces, earrings, bracelets, rings, and sets with premium quality designs at accessible prices.',
};

export default async function Homepage() {
  let featuredProducts: HomepageFeaturedProduct[] = [];
  let bestsellers: ProductListingItem[] = [];
  let newArrivals: ProductListingItem[] = [];

  try {
    console.log('[homepage] calling getFeaturedProducts, base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api (default)');
    const featuredResponse = await getFeaturedProducts(6);
    featuredProducts = featuredResponse || [];
    console.log('[homepage] SUCCESS featuredProducts count:', featuredProducts?.length);
  } catch (error) {
    console.error('[homepage] ERROR fetching featured products:', error);
  }

  try {
    const bestsellersResponse = await getProductListing({
      page: 1, limit: 8, sort: 'popular',
      categoryId: null, brandId: null, minPrice: null, maxPrice: null, q: null,
    });
    bestsellers = bestsellersResponse?.content || [];
  } catch (error) {
    console.error('ERROR fetching bestsellers:', error);
  }

  try {
    const newArrivalsResponse = await getProductListing({
      page: 1, limit: 4, sort: 'latest',
      categoryId: null, brandId: null, minPrice: null, maxPrice: null, q: null,
    });
    newArrivals = newArrivalsResponse?.content || [];
  } catch (error) {
    console.error('ERROR fetching new arrivals:', error);
  }

  return (
    <HomepageInteractive
      featuredProducts={featuredProducts}
      bestsellers={bestsellers}
      newArrivals={newArrivals}
    />
  );
}
