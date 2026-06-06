'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';

export default function WishlistInitializer() {
  const initialize = useWishlistStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
