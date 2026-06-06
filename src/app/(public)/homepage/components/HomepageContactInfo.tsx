import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ContactInfoItem {
  icon: string;
  title: string;
  content: string;
  action?: string;
  href?: string;
}

const HomepageContactInfo = () => {
  const contactDetails: ContactInfoItem[] = [
    {
      icon: 'PhoneIcon',
      title: 'Customer Service',
      content: '+1 (555) 123-4567',
      action: 'Call us',
      href: 'tel:+15551234567',
    },
    {
      icon: 'EnvelopeIcon',
      title: 'Email Support',
      content: 'support@sumshinebysums.com',
      action: 'Send email',
      href: 'mailto:support@sumshinebysums.com',
    },
    {
      icon: 'ClockIcon',
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-6PM EST\nSat: 10AM-4PM EST\nSun: Closed',
    },
    {
      icon: 'MapPinIcon',
      title: 'Visit Us',
      content: '123 Jewelry Lane, Suite 456\nNew York, NY 10001',
      action: 'Get directions',
      href: 'https://maps.google.com/?q=40.7589,-73.9851',
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-8">
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="p-3 bg-accent/10 rounded-full mb-4">
          <Icon name="ChatBubbleLeftRightIcon" size={28} className="text-accent" />
        </div>
        <h2 className="font-heading text-3xl font-semibold text-foreground mb-2">Get in Touch</h2>
        <p className="text-muted-foreground">We're here to help you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <Icon name={detail.icon as any} size={24} className="text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">{detail.title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
              {detail.content}
            </p>
            {detail.action && detail.href && (
              <a
                href={detail.href}
                target={detail.href.startsWith('http') ? '_blank' : undefined}
                rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-1 text-sm text-primary hover:text-accent transition-luxe mt-auto pt-2"
              >
                <span>{detail.action}</span>
                <Icon name="ArrowRightIcon" size={16} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageContactInfo;
