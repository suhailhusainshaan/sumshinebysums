import React from 'react';
import { Product } from '@/types/product-list';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import { useRouter } from 'next/navigation';

interface ListProductsProps {
  products: Product[]; // Use the Product interface we defined earlier
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, isFeatured: boolean) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onTogglePublished?: (id: string, isPublished: boolean) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(), // "3/12/2026" (format varies by locale)
    time: date.toLocaleTimeString(), // "1:05:08 PM"
    full: date.toLocaleString(), // "3/12/2026, 1:05:08 PM"
  };
};

const ListProducts = ({ products, onDelete, onToggleFeatured, onToggleActive, onTogglePublished }: ListProductsProps) => {
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
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center dark:text-gray-400">
                  Published
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center dark:text-gray-400">
                  Featured
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center dark:text-gray-400">
                  Active
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
                  <tr
                    key={product.id}
                    onClick={() => handleView(product.id.toString())}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
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
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePublished?.(product.id.toString(), !product.published);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${product.published ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <span className="sr-only">Toggle published</span>
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${product.published ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFeatured?.(product.id.toString(), !product.featured);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${product.featured ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <span className="sr-only">Toggle featured</span>
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${product.featured ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActive?.(product.id.toString(), !product.active);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${product.active ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <span className="sr-only">Toggle active</span>
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${product.active ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-theme-sm">
                      {formatDate(product.createdAt).date}
                    </td>
                    <td className="px-4 py-3 text-theme-sm">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-primary hover:underline"
                          onClick={() => handleView(product.id.toString())}
                        >
                          View
                        </button>
                        <button
                          className="text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product.id.toString());
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-error-500 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(product.id.toString());
                          }}
                        >
                          Delete
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
