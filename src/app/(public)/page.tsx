import type { Metadata } from 'next';
import HomepageInteractive from './homepage/components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'SumShineBySums',
  description:
    'Discover exquisite handcrafted artificial jewelry at JewelCraft. Shop necklaces, earrings, bracelets, rings, and sets with premium quality designs at accessible prices.',
};

export default function Homepage() {
  return <HomepageInteractive />;
}
