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
      content:
        'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed',
    },
  ];

  return (
    <div className="glass-panel rounded-[32px] p-6 lg:p-10">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <div className="glass-chip mb-4 rounded-full p-3">
          <Icon name="ChatBubbleLeftRightIcon" size={28} className="text-primary" />
        </div>
        <span className="text-caption mb-2 font-medium uppercase tracking-[0.24em] text-primary">
          Concierge care
        </span>
        <h2 className="mb-2 font-heading text-4xl font-semibold text-foreground">Get in Touch</h2>
        <p className="text-muted-foreground">We&apos;re here to help you pick the perfect piece</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {contactDetails.map((detail, index) => (
          <div
            key={index}
            className="glass-panel flex flex-col items-center rounded-[28px] p-6 text-center shadow-warm-sm transition-spring hover:-translate-y-1 hover:shadow-warm-md"
          >
            <div className="glass-chip mb-4 rounded-full p-3">
              <Icon name={detail.icon as any} size={24} className="text-primary" />
            </div>
            <h3 className="mb-2 font-medium text-foreground">{detail.title}</h3>
            <p className="mb-3 whitespace-pre-line text-sm text-muted-foreground">
              {detail.content}
            </p>
            {detail.action && detail.href && (
              <a
                href={detail.href}
                target={detail.href.startsWith('http') ? '_blank' : undefined}
                rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-auto inline-flex items-center space-x-1 pt-2 text-sm font-medium text-primary transition-luxe hover:text-accent"
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
