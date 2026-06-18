'use client';

interface SliderDotsProps {
  className: string;
}

export default function SliderDots({ className }: SliderDotsProps) {
  return (
    <div
      className={`${className} absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/50 bg-white/55 px-3 py-2 shadow-lg backdrop-blur`}
    />
  );
}
