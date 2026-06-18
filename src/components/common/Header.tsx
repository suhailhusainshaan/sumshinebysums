'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import UserDropdown from '@/components/common/UserDropdown';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import WishlistBadge from '@/components/wishlist/WishlistBadge';

interface HeaderProps {
  cartItemCount?: number;
  onSearchClick?: () => void;
  onCartClick?: () => void;
}

const Header = ({ cartItemCount = 0, onSearchClick, onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
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

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  if (isLoading) {
    return <nav>Loading...</nav>; // Prevents flicker
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-ivory/95 backdrop-blur-md border-b border-mist z-header transition-luxe">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <div className="flex items-center space-x-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gold"
              >
                <path d="M16 4L8 12L16 20L24 12L16 4Z" fill="currentColor" opacity="0.9" />
                <path d="M16 14L12 18L16 22L20 18L16 14Z" fill="currentColor" opacity="0.7" />
                <circle cx="16" cy="16" r="2" fill="currentColor" />
              </svg>
              <span className="font-display text-2xl tracking-wide text-ink">
                Sumshine By Sums
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link
              href="/product-listing"
              className="text-ink hover:text-gold transition-luxe text-sm font-medium uppercase tracking-widest"
            >
              Shop
            </Link>
            <Link
              href="/wishlist"
              className="text-ink hover:text-gold transition-luxe text-sm font-medium uppercase tracking-widest"
            >
              Favourites
            </Link>
            <Link
              href="/contact-support"
              className="text-ink hover:text-gold transition-luxe text-sm font-medium uppercase tracking-widest"
            >
              Support
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-5">
            <button
              onClick={handleSearchClick}
              className="p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Search"
            >
              <Icon name="MagnifyingGlassIcon" size={20} />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Wishlist"
            >
              <Icon name="HeartIcon" size={20} />
              <WishlistBadge />
            </Link>

            <button
              onClick={handleCartClick}
              className="relative p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingBagIcon" size={20} />
              {cartItemCount > 0 && (
                <span className="absolute 0 right-0 bg-gold text-porcelain text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <button
                onClick={handleLoginClick}
                className="p-2 text-ink hover:text-gold transition-luxe flex items-center justify-center"
                aria-label="Login"
              >
                <Icon name="UserIcon" size={20} />
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleSearchClick}
              className="p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Search"
            >
              <Icon name="MagnifyingGlassIcon" size={20} />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Wishlist"
            >
              <Icon name="HeartIcon" size={20} />
              <WishlistBadge />
            </Link>
            <button
              onClick={handleCartClick}
              className="relative p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingBagIcon" size={20} />
              {cartItemCount > 0 && (
                <span className="absolute 0 right-0 bg-gold text-porcelain text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-ink hover:text-gold transition-luxe"
              aria-label="Menu"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-t border-mist shadow-sm absolute w-full">
          <nav className="px-4 py-6 flex flex-col space-y-2">
            <Link
              href="/product-listing"
              className="text-ink hover:text-gold transition-luxe font-medium uppercase tracking-widest text-sm py-3 border-b border-mist/50"
              onClick={closeMobileMenu}
            >
              Shop
            </Link>
            <Link
              href="/wishlist"
              className="text-ink hover:text-gold transition-luxe font-medium uppercase tracking-widest text-sm py-3 border-b border-mist/50"
              onClick={closeMobileMenu}
            >
              Favourites
            </Link>
            <Link
              href="/contact-support"
              className="text-ink hover:text-gold transition-luxe font-medium uppercase tracking-widest text-sm py-3"
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
