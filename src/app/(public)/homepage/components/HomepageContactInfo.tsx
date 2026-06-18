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
    <div className="bg-ivory rounded-none border border-mist shadow-warm-sm p-6 lg:p-12">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="p-3 bg-gold/10 rounded-full mb-4">
          <Icon name="ChatBubbleLeftRightIcon" size={28} className="text-gold" />
        </div>
        <h2 className="font-display text-4xl text-ink tracking-wide mb-3">Get in Touch</h2>
        <p className="text-ink/70">We're here to help you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="p-3 bg-mist/30 rounded-full mb-5">
              <Icon name={detail.icon as any} size={24} className="text-gold" />
            </div>
            <h3 className="font-medium text-ink mb-2 uppercase tracking-widest text-sm">{detail.title}</h3>
            <p className="text-sm text-ink/70 whitespace-pre-line mb-3">
              {detail.content}
            </p>
            {detail.action && detail.href && (
              <a
                href={detail.href}
                target={detail.href.startsWith('http') ? '_blank' : undefined}
                rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-1 text-sm text-ink/80 hover:text-gold transition-luxe mt-auto pt-2"
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
