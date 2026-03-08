import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContactSupportInteractive from './components/ContactSupportInteractive';

export const metadata: Metadata = {
  title: 'Contact Support - JewelCraft',
  description: 'Get in touch with JewelCraft customer support team. We offer multiple communication channels including live chat, email, and phone support with comprehensive FAQ resources to help you with orders, shipping, returns, and product inquiries.',
};

export default function ContactSupportPage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Contact Support' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={3} />
      
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How Can We Help You?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our dedicated support team is here to assist you with any questions or concerns about your JewelCraft experience.
            </p>
          </div>

          <ContactSupportInteractive />

          <div className="mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 text-center">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              For urgent matters requiring immediate attention, our phone support team is available during business hours to provide real-time assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-luxe"
              >
                <span>Call Now: +1 (555) 123-4567</span>
              </a>
              <a
                href="mailto:support@jewelcraft.com"
                className="inline-flex items-center space-x-2 bg-card text-foreground border border-border px-6 py-3 rounded-md font-medium hover:bg-muted transition-luxe"
              >
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}