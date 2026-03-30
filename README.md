# Sumshine Admin (Next.js)

A modern Next.js 15 admin dashboard for managing products, variants, and catalog data. Built with TypeScript and Tailwind CSS.

## 🚀 Highlights

- Product management (list, view, edit)
- Variant management UI (edit route, image grid, local uploads/removals)
- Category-driven product editing
- Polished admin UI (tinted headers, skeleton loaders, summary strips)

## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) to view the app.

## 📍 Key Routes

- Product list: `/admin/product`
- Product view: `/admin/product/[id]`
- Product edit: `/admin/product/[id]/edit`
- Variant edit: `/admin/product/variant/[id]/edit`

## 📁 Project Structure

```
.
├── public/             # Static assets
├── src/
│   ├── app/            # App router pages (admin lives here)
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom hooks
│   ├── icons/          # Icon sets
│   ├── lib/            # Shared utilities (axios client, etc.)
│   └── types/          # TypeScript types
├── docs/               # API and project docs
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔌 API Base

The frontend expects APIs at:
```
http://localhost:8080/api
```

## 📄 API Contract

The backend contract for product + variant APIs is documented here:
- `docs/product-admin-api.md`

## 🧩 Editing Pages

Admin pages live under `src/app/admin`. Edits hot-reload during development.

## 🎨 Styling & UI

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:

  ```bash
  npm run build
  ```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by Next.js and React
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
