'use client';

import AppImage from '@/components/ui/AppImage';
import { HomepageSlider } from '@/app/(public)/homepage/types';
import { resolveImageSrc } from '@/lib/image';
import Link from 'next/link';

interface SliderCardProps {
  slide: HomepageSlider;
  priority?: boolean;
  onClick: (slide: HomepageSlider) => void;
}

export default function SliderCard({ slide, priority = false, onClick }: SliderCardProps) {
  const imageUrl = resolveImageSrc(slide.imageUrl);
  const hasRedirect = Boolean(slide.redirectUrl?.trim());
  const url = slide.redirectUrl?.trim() || '#';
  const isInternal = url.startsWith('/') && !url.startsWith('//');

  const content = (
    <>
      <AppImage
        src={imageUrl}
        alt={slide.altText || 'Homepage promotional banner'}
        fill
        priority={priority}
        sizes="100vw"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
    </>
  );

  if (!hasRedirect) {
    return (
      <div className="relative block h-full w-full overflow-hidden text-left cursor-default">
        {content}
      </div>
    );
  }

  if (isInternal) {
    return (
      <Link
        href={url}
        className="relative block h-full w-full overflow-hidden text-left cursor-pointer"
        aria-label={`Open ${slide.altText || 'homepage promotion'}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={url}
      className="relative block h-full w-full overflow-hidden text-left cursor-pointer"
      aria-label={`Open ${slide.altText || 'homepage promotion'}`}
    >
      {content}
    </a>
  );
}
