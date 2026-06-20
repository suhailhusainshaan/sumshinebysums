import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ContactInfoItem {
  icon: string;
  title: string;
  content: string;
  action?: string;
  href?: string;
}

const ContactInfo = () => {
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
      content:
        'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed',
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Get in Touch</h2>
          <p className="text-caption text-muted-foreground">We're here to help you</p>
        </div>
      </div>

      <div className="space-y-6">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="p-3 bg-muted rounded-lg flex-shrink-0">
              <Icon name={detail.icon as any} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground mb-1">{detail.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-2">
                {detail.content}
              </p>
              {detail.action && detail.href && (
                <a
                  href={detail.href}
                  className="inline-flex items-center space-x-1 text-sm text-primary hover:text-accent transition-luxe"
                >
                  <span>{detail.action}</span>
                  <Icon name="ArrowRightIcon" size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
