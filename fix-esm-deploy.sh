#!/bin/bash

echo "🚀 Fixing ES Modules for GitHub Pages Deployment..."

# 1. Update package.json for ES modules
npm pkg set type="module"

# 2. Update next.config.mjs
cat > next.config.mjs << 'EOF'
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
EOF

# 3. Create GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_OPTIONS: '--experimental-vm-modules'
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

# 4. Update package.json scripts
npm pkg set scripts.export="next export"
npm pkg set scripts.preview="next start"
npm pkg set scripts.deploy="npm run build && npm run export"

echo "✅ ES Modules deployment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create repo on GitHub: https://github.com/new"
echo "2. Run: git init"
echo "3. Run: git add ."
echo "4. Run: git commit -m 'Initial commit'"
echo "5. Run: git remote add origin https://github.com/YOUR_USERNAME/sumshinebysums.git"
echo "6. Run: git push -u origin main"
echo "7. Go to GitHub → Settings → Pages → Select GitHub Actions"