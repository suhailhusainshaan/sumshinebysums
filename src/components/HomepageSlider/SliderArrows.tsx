'use client';

interface SliderArrowsProps {
  prevClassName: string;
  nextClassName: string;
}

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={direction === 'left' ? 'M15 18L9 12L15 6' : 'M9 6L15 12L9 18'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SliderArrows({ prevClassName, nextClassName }: SliderArrowsProps) {
  const baseClass =
    'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-gray-800 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 md:flex';

  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        className={`${baseClass} left-5 ${prevClassName}`}
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={`${baseClass} right-5 ${nextClassName}`}
      >
        <ArrowIcon direction="right" />
      </button>
    </>
  );
}
