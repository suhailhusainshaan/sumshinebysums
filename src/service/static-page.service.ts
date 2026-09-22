import { StaticPage } from '@/types/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export async function getPageBySlug(slug: string): Promise<StaticPage | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/${slug}`, { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    const json = await response.json();
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    console.error('Error fetching static page:', error);
    return null;
  }
}
