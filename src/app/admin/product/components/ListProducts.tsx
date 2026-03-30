import React from 'react';
import { Product } from '@/types/product-list';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import { useRouter } from 'next/navigation';

interface ListProductsProps {
  products: Product[]; // Use the Product interface we defined earlier
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(), // "3/12/2026" (format varies by locale)
    time: date.toLocaleTimeString(), // "1:05:08 PM"
    full: date.toLocaleString(), // "3/12/2026, 1:05:08 PM"
  };
};

const ListProducts = ({ products }: { products: any[] }) => {
  const router = useRouter();

  const handleEdit = (id: string) => {
    if (id) {
      router.push('/admin/product/' + id + '/edit/');
    }
  };

  const handleView = (id: string) => {
    if (id) {
      router.push('/admin/product/' + id);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-100 bg-gray-50/70 dark:border-white/[0.05] dark:bg-white/[0.02]">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Product
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Category
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Added On
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-start dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((product) => {
                const displayImage =
                  product.images?.find((img: any) => img.featureImage)?.imageUrl ||
                  '/images/fallbacks/no_product.jpg';

                return (
                  <tr key={product.id}>
                    <td className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-lg border">
                          <Image
                            width={48}
                            height={48}
                            src={process.env.NEXT_PUBLIC_IMG_URL + displayImage}
                            alt={product.name}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {product.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-theme-sm">
                      <Badge size="sm" color="light">
                        {product.category?.name || 'N/A'}
                      </Badge>
                    </td>
                    <td>
                      <Badge size="sm" color={product.published ? 'success' : 'warning'}>
                        {product.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-theme-sm">
                      {formatDate(product.createdAt).date}
                    </td>
                    <td className="px-4 py-3 text-theme-sm">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-primary hover:underline"
                          onClick={() => handleView(product.id)}
                        >
                          View
                        </button>
                        <button
                          className="text-primary hover:underline"
                          onClick={() => handleEdit(product.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProducts;
