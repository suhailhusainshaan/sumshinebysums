import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import CheckoutSummaryInteractive from './components/CheckoutSummaryInteractive';

export const metadata: Metadata = {
  title: 'Order Summary - Sumshine By Sums',
  description:
    'Review your delivery address, cart items, stock status, and totals before checkout.',
};

export default function CheckoutSummaryPage() {
  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Cart', path: '/shopping-cart' },
    { label: 'Address', path: '/checkout-process' },
    { label: 'Order Summary' },
  ];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Order Summary
            </h1>
            <p className="text-muted-foreground">
              Review your order details before proceeding to checkout.
            </p>
          </div>
          <CheckoutSummaryInteractive />
        </div>
      </main>
    </>
  );
}
