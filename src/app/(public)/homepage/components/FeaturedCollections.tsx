import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  itemCount: number;
}

const FeaturedCollections = () => {
  const collections: Collection[] = [
    {
      id: '1',
      name: 'Necklaces',
      description: 'Statement pieces that elevate any outfit',
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      alt: 'Gold layered necklace with delicate chains displayed on white fabric background',
      category: 'necklaces',
      itemCount: 156,
    },
    {
      id: '2',
      name: 'Earrings',
      description: 'From subtle studs to dramatic drops',
      image: 'https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg',
      alt: 'Rose gold chandelier earrings with crystal details on velvet display',
      category: 'earrings',
      itemCount: 203,
    },
    {
      id: '3',
      name: 'Bracelets',
      description: 'Elegant wrist adornments for every occasion',
      image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
      alt: 'Silver charm bracelet with multiple decorative pendants on marble surface',
      category: 'bracelets',
      itemCount: 128,
    },
    {
      id: '4',
      name: 'Rings',
      description: 'Timeless designs that make a statement',
      image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg',
      alt: 'Gold stackable rings with gemstone accents arranged on white background',
      category: 'rings',
      itemCount: 187,
    },
    {
      id: '5',
      name: 'Sets',
      description: 'Perfectly coordinated jewelry collections',
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      alt: 'Complete jewelry set with matching necklace earrings and bracelet in gold finish',
      category: 'sets',
      itemCount: 94,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of jewelry categories, each designed to complement your unique style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/product-listing?category=${collection.category}`}
              className="group relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-warm-lg transition-luxe"
            >
              <div className="relative h-80 overflow-hidden">
                <AppImage
                  src={collection.image}
                  alt={collection.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-spring duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-2xl font-semibold text-foreground">
                    {collection.name}
                  </h3>
                  <Icon
                    name="ArrowRightIcon"
                    size={20}
                    className="text-primary group-hover:translate-x-1 transition-spring"
                  />
                </div>
                <p className="text-muted-foreground mb-2">{collection.description}</p>
                <p className="text-caption text-primary font-medium">
                  {collection.itemCount} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;