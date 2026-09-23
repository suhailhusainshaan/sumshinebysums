import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumshinebysums.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/checkout-process/', '/shopping-cart/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
