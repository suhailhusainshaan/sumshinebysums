import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContactSupportInteractive from './components/ContactSupportInteractive';

export const metadata: Metadata = {
  title: 'Contact Support - Sumshine By Sums',
  description:
    'Get in touch with Sumshine By Sums customer support team. We offer multiple communication channels including live chat, email, and phone support with comprehensive FAQ resources to help you with orders, shipping, returns, and product inquiries.',
};

export default function ContactSupportPage() {
  const breadcrumbItems = [{ label: 'Home', path: '/' }, { label: 'Contact Support' }];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Need help with your order?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are here to support you with your concerns.
            </p>
          </div>

          <ContactSupportInteractive />
        </div>
      </main>
    </div>
  );
}
