import type { Metadata } from 'next';
import ProductListingInteractive from './components/ProductListingInteractive';

export const metadata: Metadata = {
  title: 'Shop All Products - JewelCraft',
  description: 'Browse our complete collection of elegant artificial jewelry including necklaces, earrings, bracelets, rings, and sets. Filter by category, material, color, and price to find your perfect piece.',
};

export default function ProductListingPage() {
  return <ProductListingInteractive />;
}