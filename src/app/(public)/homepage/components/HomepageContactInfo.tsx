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
      content: '+91 9818341754',
      action: 'Call us',
      href: 'tel:+919818341754',
    },
    {
      icon: 'EnvelopeIcon',
      title: 'Email Support',
      content: 'sumshinebysums@gmail.com',
      action: 'Send email',
      href: 'mailto:sumshinebysums@gmail.com',
    },
    {
      icon: 'ClockIcon',
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
