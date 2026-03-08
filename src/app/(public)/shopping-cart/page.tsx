import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Shopping Cart - JewelCraft',
  description: 'Review your selected jewelry items, manage quantities, and proceed to secure checkout with free shipping on orders over $50.',
};

export default function ShoppingCartPage() {
  return (
    <>
      <Header cartItemCount={3} />
      <ShoppingCartInteractive />
    </>
  );
}