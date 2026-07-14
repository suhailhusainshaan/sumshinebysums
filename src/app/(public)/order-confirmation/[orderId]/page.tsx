import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import OrderConfirmationInteractive from './components/OrderConfirmationInteractive';

export const metadata: Metadata = {
  title: 'Order Confirmation - Sumshine By Sums',
  description: 'Your order has been placed.',
};

export default function OrderConfirmationPage() {
  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Cart', path: '/shopping-cart' },
    { label: 'Order Confirmation' },
  ];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <OrderConfirmationInteractive />
        </div>
      </main>
    </>
  );
}
