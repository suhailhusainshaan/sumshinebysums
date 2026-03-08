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
      content: '+1 (555) 123-4567',
      action: 'Call us',
      href: 'tel:+15551234567',
    },
    {
      icon: 'EnvelopeIcon',
      title: 'Email Support',
      content: 'support@jewelcraft.com',
      action: 'Send email',
      href: 'mailto:support@jewelcraft.com',
    },
    {
      icon: 'ClockIcon',
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 4:00 PM EST\nSunday: Closed',
      action: '',
    },
    {
      icon: 'MapPinIcon',
      title: 'Visit Us',
      content: '123 Jewelry Lane, Suite 456\nNew York, NY 10001',
      action: 'Get directions',
      href: 'https://maps.google.com/?q=40.7589,-73.9851',
    },
  ];

  const responseMetrics = [
    { label: 'Average Response Time', value: '< 2 hours', icon: 'ClockIcon' },
    { label: 'Customer Satisfaction', value: '98%', icon: 'StarIcon' },
    { label: 'Resolution Rate', value: '95%', icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-warm-md p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Get in Touch
            </h2>
            <p className="text-caption text-muted-foreground">
              We're here to help you
            </p>
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
                    target={detail.href.startsWith('http') ? '_blank' : undefined}
                    rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg shadow-warm p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          Our Commitment to You
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {responseMetrics.map((metric, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="p-2 bg-card rounded-lg">
                <Icon name={metric.icon as any} size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-data font-semibold text-foreground">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="ExclamationTriangleIcon" size={24} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-2">Urgent Issues?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              For time-sensitive matters like order cancellations or payment issues, please call us directly for immediate assistance.
            </p>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center space-x-2 text-sm font-medium text-warning hover:text-warning/80 transition-luxe"
            >
              <Icon name="PhoneIcon" size={16} />
              <span>Call Emergency Line</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;