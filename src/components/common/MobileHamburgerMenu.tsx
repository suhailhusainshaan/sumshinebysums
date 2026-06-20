'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MobileHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileHamburgerMenu = ({ isOpen, onClose }: MobileHamburgerMenuProps) => {
  const cartQty = useCartStore((s) => s.cart?.totalQuantity ?? 0);
  const wishlistCount = useWishlistStore((s) => s.totalCount);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const handleLinkClick = () => {
    onClose();
    setExpandedItem(null);
  };

  const handleLoginClick = () => {
    onClose();
    router.push('/login');
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-warm-xl z-[999] flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path d="M16 4L8 12L16 20L24 12L16 4Z" fill="currentColor" opacity="0.9" />
              <path d="M16 14L12 18L16 22L20 18L16 14Z" fill="currentColor" opacity="0.7" />
              <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
            <span className="font-heading text-lg font-semibold text-foreground">Sumshine</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-foreground hover:text-primary transition-luxe rounded-md"
            aria-label="Close menu"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {/* Shop with submenu */}
          <div>
            <button
              onClick={() => setExpandedItem(expandedItem === 'shop' ? null : 'shop')}
              className="w-full flex items-center justify-between px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe"
            >
              <div className="flex items-center gap-3">
                <Icon name="SparklesIcon" size={20} className="text-primary" />
                <span className="font-medium">Shop</span>
              </div>
              <Icon
                name="ChevronDownIcon"
                size={18}
                className={`text-muted-foreground transition-transform duration-200 ${expandedItem === 'shop' ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedItem === 'shop' && (
              <div className="ml-9 mt-1 space-y-1">
                {[
                  { label: 'All Products', path: '/product-listing' },
                  { label: 'Necklaces', path: '/product-listing?category_id=necklaces' },
                  { label: 'Earrings', path: '/product-listing?category_id=earrings' },
                  { label: 'Bracelets', path: '/product-listing?category_id=bracelets' },
                  { label: 'Rings', path: '/product-listing?category_id=rings' },
                ].map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.path}
                    onClick={handleLinkClick}
                    className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-luxe"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe mt-1"
          >
            <div className="flex items-center gap-3">
              <Icon name="HeartIcon" size={20} className="text-primary" />
              <span className="font-medium">Favourites</span>
            </div>
            {wishlistCount > 0 && (
              <span className="bg-error text-error-foreground text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/shopping-cart"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe mt-1"
          >
            <div className="flex items-center gap-3">
              <Icon name="ShoppingBagIcon" size={20} className="text-primary" />
              <span className="font-medium">Cart</span>
            </div>
            {cartQty > 0 && (
              <span className="bg-accent text-accent-foreground text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {cartQty > 99 ? '99+' : cartQty}
              </span>
            )}
          </Link>

          {/* Support */}
          <Link
            href="/contact-support"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe mt-1"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-primary" />
            <span className="font-medium">Support</span>
          </Link>

          <div className="my-4 border-t border-border" />

          {/* Auth */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={20} className="text-muted-foreground" />
              <span className="font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full flex items-center gap-3 px-3 py-3 text-foreground hover:bg-muted rounded-lg transition-luxe"
            >
              <Icon name="UserIcon" size={20} className="text-primary" />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Sumshine By Sums. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileHamburgerMenu;
