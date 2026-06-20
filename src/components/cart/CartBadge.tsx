'use client';

import { useCartStore } from '@/store/cartStore';

interface CartBadgeProps {
  className?: string;
}

export default function CartBadge({ className = '' }: CartBadgeProps) {
  const totalQuantity = useCartStore((s) => s.cart?.totalQuantity ?? 0);

  if (totalQuantity === 0) return null;

  return (
    <span
      className={`
        absolute -top-1 -right-1
        bg-accent text-accent-foreground
        text-xs font-medium
        rounded-full min-w-[18px] h-[18px]
        flex items-center justify-center px-1
        ${className}
      `}
    >
      {totalQuantity > 99 ? '99+' : totalQuantity}
    </span>
  );
}
