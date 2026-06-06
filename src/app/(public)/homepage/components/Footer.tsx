import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { HomepageCategory } from '../types';

interface FooterProps {
  categories?: HomepageCategory[];
}

const Footer = ({ categories = [] }: FooterProps) => {
  const currentYear = new Date()?.getFullYear();

  const shopLinks = categories
    .filter((category) => category.active ?? category.isActive ?? true)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))
    .slice(0, 5)
    .map((category) => ({
      label: category.name,
      path: `/product-listing?category_id=${category.id}`,
    }));

  // If we don't have categories yet, provide fallbacks
  const finalShopLinks =
    shopLinks.length > 0
      ? shopLinks
      : [
        { label: 'Necklaces', path: '/product-listing?category=necklaces' },
        { label: 'Earrings', path: '/product-listing?category=earrings' },
        { label: 'Bracelets', path: '/product-listing?category=bracelets' },
        { label: 'Rings', path: '/product-listing?category=rings' },
        { label: 'Sets', path: '/product-listing?category=sets' },
      ];

  const footerLinks = {
    help: [
      { label: 'Contact Us', path: '/contact-support' },
      { label: 'FAQ', path: '/contact-support' },
    ],
    company: [
      { label: 'About Us', path: '/' },
      { label: 'Privacy Policy', path: '/' },
      { label: 'Terms of Service', path: '/' },
      { label: 'Careers', path: '/' },
    ],
  };

  const socialLinks = [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/sumshinebysums' },
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
                <path d="M16 4L8 12L16 20L24 12L16 4Z" fill="currentColor" opacity="0.9" />
                <path d="M16 14L12 18L16 22L20 18L16 14Z" fill="currentColor" opacity="0.7" />
                <circle cx="16" cy="16" r="2" fill="currentColor" />
              </svg>
              <span className="font-heading text-xl font-semibold text-foreground">
                Sumshine By Sums
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 mt-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.icon}
                  href={social?.url}
                  aria-label={social?.label}
                  className="w-14 h-14 flex items-center justify-center bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-luxe"
                >
                  {social?.icon === 'instagram' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ) : (
                    <Icon name="ShareIcon" size={28} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              {finalShopLinks?.map((link) => (
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
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Help</h3>
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
          {/*<div>*/}
          {/*  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Company</h3>*/}
          {/*  <ul className="space-y-3">*/}
          {/*    {footerLinks?.company?.map((link) => (*/}
          {/*      <li key={link?.label}>*/}
          {/*        <Link*/}
          {/*          href={link?.path}*/}
          {/*          className="text-muted-foreground hover:text-primary transition-luxe"*/}
          {/*        >*/}
          {/*          {link?.label}*/}
          {/*        </Link>*/}
          {/*      </li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-caption text-muted-foreground text-center sm:text-left">
              © {currentYear} Sumshine By Sums. All rights reserved.
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
