import type { Metadata } from 'next';
import HomepageInteractive from './homepage/components/HomepageInteractive';
import { getFeaturedProducts, getProductListing } from '@/service/public-product.service';
import { HomepageFeaturedProduct } from './homepage/types';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SumShineBySums',
  description:
    'Discover exquisite handcrafted artificial jewelry at JewelCraft. Shop necklaces, earrings, bracelets, rings, and sets with premium quality designs at accessible prices.',
};

export default async function Homepage() {
  let featuredProducts: HomepageFeaturedProduct[] = [];
  let bestsellers: ProductListingItem[] = [];
  let newArrivals: ProductListingItem[] = [];

  try {
    const featuredResponse = await getFeaturedProducts(6);
    featuredProducts = featuredResponse || [];
  } catch (error) {
    console.error('[root page] ERROR fetching featured products:', error);
  }

  try {
    const bestsellersResponse = await getProductListing({
      page: 1, limit: 8, sort: 'popular',
      categoryId: null, brandId: null, minPrice: null, maxPrice: null, q: null,
    });
    bestsellers = bestsellersResponse?.content || [];
  } catch (error) {
    console.error('[root page] ERROR fetching bestsellers:', error);
  }

  try {
    const newArrivalsResponse = await getProductListing({
      page: 1, limit: 4, sort: 'latest',
      categoryId: null, brandId: null, minPrice: null, maxPrice: null, q: null,
    });
    newArrivals = newArrivalsResponse?.content || [];
  } catch (error) {
    console.error('[root page] ERROR fetching new arrivals:', error);
  }

  return (
    <HomepageInteractive
      featuredProducts={featuredProducts}
      bestsellers={bestsellers}
      newArrivals={newArrivals}
    />
  );
}

