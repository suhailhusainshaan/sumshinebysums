import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - JewelCraft',
  description: 'Complete your purchase securely with our streamlined checkout process. Enter shipping details, select delivery options, and finalize payment for your artificial jewelry order.',
};

export default function CheckoutProcessPage() {
  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Cart', path: '/shopping-cart' },
    { label: 'Checkout' },
  ];

  return (
    <>
      <Header cartItemCount={3} />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Secure Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order in just a few simple steps
            </p>
          </div>
          <CheckoutInteractive />
        </div>
      </main>
    </>
  );
}