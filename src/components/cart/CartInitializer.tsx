'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartInitializer() {
  const initialize = useCartStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
