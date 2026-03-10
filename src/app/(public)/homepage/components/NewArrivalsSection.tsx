import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface NewArrival {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  isNew: boolean;
}

const NewArrivalsSection = () => {
  const newArrivals: NewArrival[] = [
    {
      id: '9',
      name: 'Moonstone Pendant Necklace',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
      alt: 'Silver necklace with oval moonstone pendant and delicate chain',
      category: 'necklaces',
      isNew: true,
    },
    {
      id: '10',
      name: 'Geometric Hoop Earrings',
      price: 42.99,
      image: 'https://images.pixabay.com/photo/2017/11/22/19/00/jewelry-2971103_1280.jpg',
      alt: 'Modern geometric gold hoop earrings with angular design',
      category: 'earrings',
      isNew: true,
    },
    {
      id: '11',
      name: 'Tennis Bracelet',
      price: 94.99,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      alt: 'Classic tennis bracelet with continuous line of cubic zirconia stones',
      category: 'bracelets',
      isNew: true,
    },
    {
      id: '12',
      name: 'Stackable Ring Trio',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
      alt: 'Three stackable gold rings with different textures and finishes',
      category: 'rings',
      isNew: true,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <p className="text-caption text-accent font-medium">Just Arrived</p>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be the first to discover our latest jewelry designs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((item) => (
            <Link
              key={item.id}
              href={`/product-detail?id=${item.id}`}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-warm-lg transition-luxe"
            >
              <div className="relative h-80 overflow-hidden bg-muted">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-spring duration-500"
                />
                {item.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-success text-success-foreground text-caption font-medium rounded-full">
                    New
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-foreground mb-2 line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-data text-lg font-semibold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <Icon
                    name="ArrowRightIcon"
                    size={20}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-spring"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/product-listing?category=new-arrivals"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:scale-102 hover:shadow-warm-md transition-spring"
          >
            <span>Explore All New Arrivals</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;