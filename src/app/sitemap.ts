import { MetadataRoute } from 'next';
import { getCategories, getProductListing } from '@/service/public-product.service';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumshinebysums.com';

  // Core static routes
  const staticRoutes = [
    '',
    '/product-listing',
    '/contact-support',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Categories
    const categories = await getCategories();
    const categoryRoutes = (categories || []).map((cat) => ({
      url: `${baseUrl}/product-listing?category_id=${cat.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Dynamic Products (fetching top 100 for sitemap)
    const productsRes = await getProductListing({
      page: 1,
      limit: 100,
      sort: 'latest',
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      q: null,
    });
    
    const productRoutes = (productsRes?.content || []).map((product) => ({
      url: `${baseUrl}/product-detail/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static routes if API fails
    return staticRoutes;
  }
}
