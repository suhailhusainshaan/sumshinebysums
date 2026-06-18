'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  submenu?: MenuItem[];
}

interface MobileHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount?: number;
}

const MobileHamburgerMenu = ({ isOpen, onClose, cartItemCount = 0 }: MobileHamburgerMenuProps) => {
  const menuItems: MenuItem[] = [
    {
      label: 'Shop',
      path: '/product-listing',
      icon: 'SparklesIcon',
      submenu: [
        { label: 'Necklaces', path: '/product-listing?category=necklaces' },
        { label: 'Earrings', path: '/product-listing?category=earrings' },
        { label: 'Bracelets', path: '/product-listing?category=bracelets' },
        { label: 'Rings', path: '/product-listing?category=rings' },
        { label: 'Sets', path: '/product-listing?category=sets' },
      ],
    },
    {
      label: 'Cart',
      path: '/shopping-cart',
      icon: 'ShoppingBagIcon',
    },
    {
      label: 'Account',
      path: '/',
      icon: 'UserIcon',
    },
    {
      label: 'Support',
      path: '/contact-support',
      icon: 'ChatBubbleLeftRightIcon',
    },
  ];

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const handleLinkClick = () => {
    onClose();
    setExpandedItem(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-mobile-menu transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-ivory shadow-warm-xl z-mobile-menu transform transition-transform duration-300 ease-luxe overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mist">
          <h2 className="font-display text-2xl tracking-wide text-ink">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-ink hover:text-gold transition-luxe"
            aria-label="Close menu"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="w-full flex items-center justify-between p-4 text-ink hover:bg-mist/30 rounded-md transition-luxe"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <Icon name={item.icon as any} size={20} />}
                      <span className="font-medium text-sm uppercase tracking-widest">{item.label}</span>
                    </div>
                    <Icon
                      name="ChevronDownIcon"
                      size={20}
                      className={`transform transition-transform ${expandedItem === item.label ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {expandedItem === item.label && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.path}
                          className="block p-3 text-ink/70 hover:text-gold hover:bg-mist/30 rounded-md transition-luxe text-sm uppercase tracking-widest"
                          onClick={handleLinkClick}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className="flex items-center justify-between p-4 text-ink hover:bg-mist/30 rounded-md transition-luxe"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <Icon name={item.icon as any} size={20} />}
                    <span className="font-medium text-sm uppercase tracking-widest">{item.label}</span>
                  </div>
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <span className="bg-gold text-porcelain text-[10px] font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-mist bg-ivory">
          <p className="text-xs text-ink/60 uppercase tracking-widest text-center">
            © 2026 Sumshine By Sums. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileHamburgerMenu;
