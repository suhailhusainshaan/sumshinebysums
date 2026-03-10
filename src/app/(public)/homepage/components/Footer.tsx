import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    shop: [
      { label: 'Necklaces', path: '/product-listing?category=necklaces' },
      { label: 'Earrings', path: '/product-listing?category=earrings' },
      { label: 'Bracelets', path: '/product-listing?category=bracelets' },
      { label: 'Rings', path: '/product-listing?category=rings' },
      { label: 'Sets', path: '/product-listing?category=sets' },
    ],
    help: [
      { label: 'Contact Us', path: '/contact-support' },
      { label: 'Shipping Info', path: '/contact-support' },
      { label: 'Returns', path: '/contact-support' },
      { label: 'Size Guide', path: '/contact-support' },
      { label: 'FAQ', path: '/contact-support' },
    ],
    company: [
      { label: 'About Us', path: '/homepage' },
      { label: 'Privacy Policy', path: '/homepage' },
      { label: 'Terms of Service', path: '/homepage' },
      { label: 'Careers', path: '/homepage' },
    ],
  };

  const socialLinks = [
    { icon: 'facebook', label: 'Facebook', url: '#' },
    { icon: 'instagram', label: 'Instagram', url: '#' },
    { icon: 'pinterest', label: 'Pinterest', url: '#' },
    { icon: 'twitter', label: 'Twitter', url: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M16 4L8 12L16 20L24 12L16 4Z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M16 14L12 18L16 22L20 18L16 14Z"
                  fill="currentColor"
                  opacity="0.7"
                />
                <circle cx="16" cy="16" r="2" fill="currentColor" />
              </svg>
              <span className="font-heading text-xl font-semibold text-foreground">
                JewelCraft
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Elegant artificial jewelry that captures the essence of luxury at accessible prices.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks?.map((social) => (
                <a
                  key={social?.icon}
                  href={social?.url}
                  aria-label={social?.label}
                  className="w-10 h-10 flex items-center justify-center bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-luxe"
                >
                  <Icon name="ShareIcon" size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks?.shop?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.path}
                    className="text-muted-foreground hover:text-primary transition-luxe"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Help
            </h3>
            <ul className="space-y-3">
              {footerLinks?.help?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.path}
                    className="text-muted-foreground hover:text-primary transition-luxe"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <Link
                    href={link?.path}
                    className="text-muted-foreground hover:text-primary transition-luxe"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-caption text-muted-foreground text-center sm:text-left">
              © {currentYear} JewelCraft. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Icon name="CreditCardIcon" size={32} className="text-muted-foreground" />
              <Icon name="ShieldCheckIcon" size={32} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;