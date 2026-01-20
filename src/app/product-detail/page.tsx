import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductDetailInteractive from './components/ProductDetailInteractive';

export const metadata: Metadata = {
  title: 'Rose Gold Elegance Necklace - JewelCraft',
  description:
    'Discover the exquisite Rose Gold Elegance Necklace featuring premium artificial jewelry craftsmanship. View detailed images, customer reviews, sizing information, and complete your look with matching accessories.',
};

export default function ProductDetailPage() {
  const productData = {
    name: 'Rose Gold Elegance Necklace',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 127,
    material: 'High-Quality Brass with Rose Gold Plating',
    availability: 'In Stock',
    sku: 'JC-RGN-2024-001',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
        alt: 'Rose gold necklace with delicate chain and pendant displayed on white marble surface',
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
        alt: 'Close-up detail of rose gold necklace pendant showing intricate floral design',
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
        alt: 'Rose gold necklace worn by model with elegant white dress in natural lighting',
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
        alt: 'Side view of rose gold necklace showing chain length and clasp detail',
      },
      {
        id: '5',
        url: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg',
        alt: 'Rose gold necklace in luxury gift box with velvet interior',
      },
    ],
    description: `Elevate your style with our stunning Rose Gold Elegance Necklace, a masterpiece of artificial jewelry craftsmanship. This exquisite piece features a delicate rose gold-plated chain adorned with a beautifully designed pendant that captures light from every angle.\n\nCrafted from high-quality brass with premium rose gold plating, this necklace offers the luxurious appearance of fine jewelry at an accessible price point. The intricate floral-inspired pendant design showcases exceptional attention to detail, making it perfect for both everyday elegance and special occasions.\n\nThe adjustable chain length ensures a comfortable fit for all necklines, while the secure lobster clasp provides peace of mind during wear. Each piece is carefully inspected to meet our rigorous quality standards, ensuring you receive jewelry that looks and feels premium.\n\nWhether you're treating yourself or searching for the perfect gift, this Rose Gold Elegance Necklace comes beautifully packaged in our signature gift box, ready to delight.`,
    careInstructions: [
      'Store in the provided jewelry box or soft pouch when not wearing to prevent scratches','Avoid contact with water, perfumes, lotions, and harsh chemicals to maintain the rose gold finish','Remove jewelry before swimming, showering, or exercising to prevent tarnishing','Clean gently with a soft, dry cloth after each wear to remove oils and maintain shine','Keep away from direct sunlight and extreme temperatures for longevity','Apply cosmetics, hairspray, and perfume before putting on your jewelry',
    ],
    reviews: [
      {
        id: '1',author: 'Sarah Mitchell',rating: 5,date: 'January 15, 2026',comment:'Absolutely stunning! The rose gold color is perfect and the quality exceeded my expectations. I wear it almost every day and always get compliments. The packaging was also beautiful - perfect for gifting!',
        verified: true,
      },
      {
        id: '2',author: 'Emily Rodriguez',rating: 5,date: 'January 10, 2026',comment:'This necklace is gorgeous! The pendant design is so elegant and delicate. It looks much more expensive than it actually is. Great value for money and fast shipping too.',
        verified: true,
      },
      {
        id: '3',author: 'Jessica Chen',rating: 4,date: 'January 5, 2026',comment:'Beautiful necklace with excellent craftsmanship. The only reason I gave 4 stars instead of 5 is that I wish the chain was slightly longer, but the adjustable length still works well for me.',
        verified: true,
      },
      {
        id: '4',author: 'Amanda Thompson',rating: 5,date: 'December 28, 2025',comment:'Bought this as a gift for my sister and she absolutely loves it! The rose gold finish is beautiful and hasn\'t tarnished at all. Will definitely be ordering more pieces from this collection.',
        verified: true,
      },
      {
        id: '5',
        author: 'Rachel Williams',
        rating: 5,
        date: 'December 20, 2025',
        comment:
          'Perfect everyday necklace! It\'s elegant enough for work but also looks great with casual outfits. The quality is impressive for artificial jewelry. Highly recommend!',
        verified: true,
      },
    ],
    shippingInfo: `We offer multiple shipping options to ensure your jewelry arrives safely and on time. All orders are carefully packaged in protective materials and our signature gift boxes.\n\nStandard Shipping (5-7 business days): Free on orders over $50, otherwise $4.99. Your order will be processed within 1-2 business days and shipped via USPS or UPS Ground.\n\nExpress Shipping (2-3 business days): $12.99 flat rate. Perfect for last-minute gifts or when you need your jewelry quickly. Orders placed before 2 PM EST ship the same day.\n\nTracking information will be sent to your email once your order ships. We ship to all 50 US states and offer international shipping to select countries. For international orders, please allow additional time for customs processing.`,
    relatedProducts: [
      {
        id: '2',
        name: 'Rose Gold Drop Earrings',
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg',
        alt: 'Elegant rose gold drop earrings with crystal accents on white background',
        rating: 4.7,
        category: 'Earrings',
      },
      {
        id: '3',
        name: 'Delicate Rose Gold Bracelet',
        price: 59.99,
        image: 'https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg',
        alt: 'Thin rose gold chain bracelet with small charm on marble surface',
        rating: 4.9,
        category: 'Bracelets',
      },
      {
        id: '4',
        name: 'Rose Gold Statement Ring',
        price: 39.99,
        originalPrice: 54.99,
        image: 'https://images.pexels.com/photos/1454173/pexels-photo-1454173.jpeg',
        alt: 'Rose gold ring with geometric design displayed on velvet cushion',
        rating: 4.6,
        category: 'Rings',
      },
      {
        id: '5',
        name: 'Rose Gold Jewelry Set',
        price: 149.99,
        originalPrice: 199.99,
        image: 'https://images.pexels.com/photos/1191538/pexels-photo-1191538.jpeg',
        alt: 'Complete rose gold jewelry set including necklace, earrings, and bracelet in gift box',
        rating: 4.8,
        category: 'Sets',
      },
      {
        id: '6',
        name: 'Layered Rose Gold Necklace',
        price: 79.99,
        image: 'https://images.pexels.com/photos/1454174/pexels-photo-1454174.jpeg',
        alt: 'Multi-strand rose gold necklace with varying chain lengths on white background',
        rating: 4.7,
        category: 'Necklaces',
      },
    ],
  };

  const breadcrumbItems = [
    { label: 'Shop', path: '/product-listing' },
    { label: 'Necklaces', path: '/product-listing?category=necklaces' },
    { label: productData.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={3} />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Product Detail Content */}
          <ProductDetailInteractive productData={productData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                About JewelCraft
              </h3>
              <p className="text-caption text-muted-foreground">
                Premium artificial jewelry designed for the modern woman. Quality craftsmanship
                meets affordable elegance.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/product-listing"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    Shop All
                  </a>
                </li>
                <li>
                  <a
                    href="/homepage"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a
                    href="/homepage"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    Best Sellers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Customer Care
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/contact-support"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/homepage"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="/homepage"
                    className="text-caption text-muted-foreground hover:text-primary transition-luxe"
                  >
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-luxe"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-luxe"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-luxe"
                  aria-label="Pinterest"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-caption text-muted-foreground">
              © {new Date().getFullYear()} JewelCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}