const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface FAQCategory {
  id?: string;
  slug?: string;
  label: string;
  icon: string;
  display_order?: number;
}

export interface FAQItem {
  id?: string | number;
  category_slug?: string;
  category?: string; // fallback
  question: string;
  answer: string;
  display_order?: number;
}

export interface FAQResponse {
  categories: FAQCategory[];
  faqs: FAQItem[];
}

export async function getFAQs(): Promise<FAQResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs`, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error(`Failed to fetch FAQs: ${response.status}`);
      return null;
    }
    
    const json = await response.json();
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return null;
  }
}
