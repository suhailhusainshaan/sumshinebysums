'use client';

import { useWishlistStore } from '@/store/wishlistStore';

interface WishlistBadgeProps {
  className?: string;
}

export default function WishlistBadge({ className = '' }: WishlistBadgeProps) {
  const totalCount = useWishlistStore((s) => s.totalCount);

  if (totalCount === 0) return null;

  return (
    <span
      className={`
        absolute -top-1 -right-1 
        bg-gold text-porcelain 
        text-[10px] font-medium 
        rounded-full min-w-[16px] h-[16px] 
        flex items-center justify-center px-1
        ${className}
      `}
    >
      {totalCount > 99 ? '99+' : totalCount}
    </span>
  );
}
