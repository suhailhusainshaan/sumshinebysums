'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import UserDropdown from '@/components/common/UserDropdown';
import MobileHamburgerMenu from '@/components/common/MobileHamburgerMenu';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import WishlistBadge from '@/components/wishlist/WishlistBadge';
import CartBadge from '@/components/cart/CartBadge';

interface HeaderProps {
  onSearchClick?: () => void;
  onCartClick?: () => void;
}

const Header = ({ onSearchClick, onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const handleSearchClick = () => {
    if (onSearchClick) onSearchClick();
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleCartClick = () => {
    if (onCartClick) onCartClick();
  };

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-card shadow-warm z-header h-16 lg:h-18" />
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card shadow-warm z-header">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-2">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary flex-shrink-0"
                >
                  <path d="M16 4L8 12L16 20L24 12L16 4Z" fill="currentColor" opacity="0.9" />
                  <path d="M16 14L12 18L16 22L20 18L16 14Z" fill="currentColor" opacity="0.7" />
                  <circle cx="16" cy="16" r="2" fill="currentColor" />
                </svg>
                <span className="font-heading text-base sm:text-xl font-semibold text-foreground">
                  Sumshine By Sums
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/product-listing"
                className="text-foreground hover:text-primary transition-luxe font-medium"
              >
                Shop
              </Link>
              <Link
                href="/wishlist"
                className="text-foreground hover:text-primary transition-luxe font-medium"
              >
                Favourites
              </Link>
              <Link
                href="/contact-support"
                className="text-foreground hover:text-primary transition-luxe font-medium"
              >
                Support
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={handleSearchClick}
                className="p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Search"
              >
                <Icon name="MagnifyingGlassIcon" size={24} />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Wishlist"
              >
                <Icon name="HeartIcon" size={24} />
                <WishlistBadge />
              </Link>

              <Link
                href="/shopping-cart"
                onClick={handleCartClick}
                className="relative p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Shopping cart"
              >
                <Icon name="ShoppingBagIcon" size={24} />
                <CartBadge />
              </Link>

              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="p-2 text-foreground hover:text-primary transition-luxe flex items-center justify-center"
                  aria-label="Login"
                >
                  <Icon name="UserIcon" size={24} />
                </button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-1">
              <button
                onClick={handleSearchClick}
                className="p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Search"
              >
                <Icon name="MagnifyingGlassIcon" size={22} />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Wishlist"
              >
                <Icon name="HeartIcon" size={22} />
                <WishlistBadge />
              </Link>

              <Link
                href="/shopping-cart"
                onClick={handleCartClick}
                className="relative p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Shopping cart"
              >
                <Icon name="ShoppingBagIcon" size={22} />
                <CartBadge />
              </Link>

              {isLoggedIn ? (
                <div className="pl-1">
                  <UserDropdown />
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="p-2 text-foreground hover:text-primary transition-luxe"
                  aria-label="Login"
                >
                  <Icon name="UserIcon" size={22} />
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-foreground hover:text-primary transition-luxe"
                aria-label="Open menu"
              >
                <Icon name="Bars3Icon" size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out mobile nav — rendered at root level so it's above everything */}
      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
