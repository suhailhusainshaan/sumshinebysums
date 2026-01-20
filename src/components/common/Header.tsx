'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  cartItemCount?: number;
  onSearchClick?: () => void;
  onCartClick?: () => void;
}

const Header = ({ cartItemCount = 0, onSearchClick, onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card shadow-warm z-header">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center" onClick={closeMobileMenu}>
            <div className="flex items-center space-x-2">
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
                SumShineBySums
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
              href="/shopping-cart"
              className="text-foreground hover:text-primary transition-luxe font-medium"
            >
              Cart
            </Link>
            <Link
              href="/homepage"
              className="text-foreground hover:text-primary transition-luxe font-medium"
            >
              Account
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
            <button
              onClick={handleCartClick}
              className="relative p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingBagIcon" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleSearchClick}
              className="p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Search"
            >
              <Icon name="MagnifyingGlassIcon" size={24} />
            </button>
            <button
              onClick={handleCartClick}
              className="relative p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingBagIcon" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-foreground hover:text-primary transition-luxe"
              aria-label="Menu"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-6 space-y-4">
            <Link
              href="/product-listing"
              className="block text-foreground hover:text-primary transition-luxe font-medium py-2"
              onClick={closeMobileMenu}
            >
              Shop
            </Link>
            <Link
              href="/shopping-cart"
              className="block text-foreground hover:text-primary transition-luxe font-medium py-2"
              onClick={closeMobileMenu}
            >
              Cart
            </Link>
            <Link
              href="/homepage"
              className="block text-foreground hover:text-primary transition-luxe font-medium py-2"
              onClick={closeMobileMenu}
            >
              Account
            </Link>
            <Link
              href="/contact-support"
              className="block text-foreground hover:text-primary transition-luxe font-medium py-2"
              onClick={closeMobileMenu}
            >
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;