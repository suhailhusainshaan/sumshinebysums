import type { Metadata } from 'next';
import HomepageInteractive from './components/HomepageInteractive';
import {
  getCategories,
  getFeaturedProducts,
  getMediaAssetByKey,
  getProductListing,
} from '@/service/public-product.service';
import { HomepageCategory, HomepageFeaturedProduct, HomepageHeroMediaAsset } from './types';
import { ProductListingItem } from '@/app/(public)/product-listing/types';

// Force this page to always re-render on the server (bypass Next.js full-route cache)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sumshine By Sums',
  description:
    'Discover exquisite handcrafted artificial jewelry at Sumshine By Sums. Shop necklaces, earrings, bracelets, rings, and sets with premium quality designs at accessible prices.',
};

export default async function Homepage() {
  let categories: HomepageCategory[] = [];
  let featuredProducts: HomepageFeaturedProduct[] = [];
  let bestsellers: ProductListingItem[] = [];
  let newArrivals: ProductListingItem[] = [];
  let heroMediaAsset: HomepageHeroMediaAsset | null = null;

  try {
    const categoriesResponse = await getCategories();
    categories = categoriesResponse || [];
  } catch (error) {
    console.error('[homepage] ERROR fetching categories:', error);
  }

  try {
    const featuredResponse = await getFeaturedProducts(6);
    featuredProducts = featuredResponse || [];
  } catch (error) {
    console.error('[homepage] ERROR fetching featured products:', error);
  }

  try {
    const bestsellersResponse = await getProductListing({
      page: 1,
      limit: 8,
      sort: 'popular',
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      q: null,
    });
    bestsellers = bestsellersResponse?.content || [];
  } catch (error) {
    console.error('ERROR fetching bestsellers:', error);
  }

  try {
    const newArrivalsResponse = await getProductListing({
      page: 1,
      limit: 4,
      sort: 'latest',
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      q: null,
    });
    newArrivals = newArrivalsResponse?.content || [];
  } catch (error) {
    console.error('ERROR fetching new arrivals:', error);
  }

  try {
    heroMediaAsset = await getMediaAssetByKey('home.hero.image');
  } catch (error) {
    console.error('ERROR fetching homepage hero media asset:', error);
  }

  return (
    <HomepageInteractive
      categories={categories}
      featuredProducts={featuredProducts}
      bestsellers={bestsellers}
      newArrivals={newArrivals}
      heroMediaAsset={heroMediaAsset}
    />
  );
}
