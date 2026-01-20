/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/sumshinebysums' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sumshinebysums/' : '',
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
