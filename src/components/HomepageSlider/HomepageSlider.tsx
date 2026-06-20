'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { HomepageSlider as HomepageSliderType } from '@/app/(public)/homepage/types';
import SliderArrows from './SliderArrows';
import SliderCard from './SliderCard';
import SliderDots from './SliderDots';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HomepageSliderProps {
  slides: HomepageSliderType[];
}

export default function HomepageSlider({ slides }: HomepageSliderProps) {
  const router = useRouter();
  const sortedSlides = useMemo(
    () => [...slides].sort((a, b) => a.displayOrder - b.displayOrder),
    [slides]
  );

  if (!sortedSlides.length) {
    return null;
  }

  const navId = sortedSlides.map((slide) => slide.id).join('-');
  const prevClassName = `homepage-slider-prev-${navId}`;
  const nextClassName = `homepage-slider-next-${navId}`;
  const dotsClassName = `homepage-slider-dots-${navId}`;


  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="relative h-[256px] sm:h-[460px] lg:h-[620px]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          loop={sortedSlides.length > 1}
          slidesPerView={1}
          speed={700}
          autoplay={
            sortedSlides.length > 1
              ? {
                  delay: 5000,
                  disableOnInteraction: false,
                }
              : false
          }
          navigation={{
            prevEl: `.${prevClassName}`,
            nextEl: `.${nextClassName}`,
          }}
          pagination={{
            el: `.${dotsClassName}`,
            clickable: true,
            bulletClass:
              'homepage-slider-dot block h-2.5 w-2.5 rounded-full bg-gray-900/30 transition',
            bulletActiveClass: 'homepage-slider-dot-active !w-7 !bg-primary',
          }}
          className="h-full"
        >
          {sortedSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <SliderCard slide={slide} priority={index === 0} onClick={() => {}} />
            </SwiperSlide>
          ))}
        </Swiper>

        {sortedSlides.length > 1 ? (
          <>
            <SliderArrows prevClassName={prevClassName} nextClassName={nextClassName} />
            {/*<SliderDots className={dotsClassName} />*/}
          </>
        ) : null}
      </div>
    </section>
  );
}
