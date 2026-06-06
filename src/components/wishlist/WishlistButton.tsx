'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useWishlistStore } from '@/store/wishlistStore';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  productId: number;
  variantId?: number;
  className?: string;
  size?: number;
  showLabel?: boolean;
}

export default function WishlistButton({
  productId,
  variantId,
  className = '',
  size = 20,
  showLabel = false,
}: WishlistButtonProps) {
  const { items, addItem, removeItem, isWishlisted } = useWishlistStore();
  const [loading, setLoading] = useState(false);

  const wishlisted = isWishlisted(productId, variantId);
  const item = items.find(
    (i) => i.productId === productId && i.variantId === (variantId ?? null)
  );

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (wishlisted && item) {
        await removeItem(item.id);
        toast.success('Removed from wishlist');
      } else {
        await addItem(productId, variantId);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`
        transition-all duration-200 
        ${wishlisted ? 'text-error' : 'text-foreground hover:text-error'} 
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {showLabel ? (
        <span className="flex items-center gap-2">
          <Icon
            name="HeartIcon"
            size={size}
            variant={wishlisted ? 'solid' : 'outline'}
            className={wishlisted ? 'text-error' : ''}
          />
          <span className="text-sm font-medium">
            {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </span>
        </span>
      ) : (
        <Icon
          name="HeartIcon"
          size={size}
          variant={wishlisted ? 'solid' : 'outline'}
          className={wishlisted ? 'text-error' : ''}
        />
      )}
    </button>
  );
}
