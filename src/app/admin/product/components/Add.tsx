'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import ComponentCard from '@/components/admin/common/ComponentCard';
import Label from '@/components/admin/form/Label';
import Input from '@/components/admin/form/input/InputField';
import Select from '@/components/admin/form/Select';
import { ChevronDownIcon } from '@/admin';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '@/components/form/input/FileInput';
import { useDropzone } from 'react-dropzone';
import { Category } from '@/types/category';

interface DefaultInputsProps {
  categories?: Category[];
  brands?: { id: number; name: string }[];
}

export default function Add({ categories = [], brands = [] }: DefaultInputsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    brandId: '',
    categoryId: '',
    features: {
      material: '',
      finish: '',
      hypoallergenic: false,
    },
    specifications: {
      material: '',
      purity: '',
      stone_type: '',
      hypoallergenic: false,
    },
    sku: '',
    variantName: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stockQuantity: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm',
    },
    altText: '',
  });

  // Helper to handle changes in nested objects
  const handleNestedChange = (
    category: 'features' | 'specifications' | 'dimensions',
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name])
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [], 'image/svg+xml': [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!imageFile) return alert('Please upload an image');
    setLoading(true);
    try {
      const data = new FormData();
      // Construct the JSON blob for the 'request' part
      const jsonRequest = JSON.stringify({
        ...formData,
        brandId: Number(formData.brandId),
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : null,
        stockQuantity: Number(formData.stockQuantity),
        weight: Number(formData.weight),
      });
      data.append('request', new Blob([jsonRequest], { type: 'application/json' }));
      if (imageFile) {
        data.append('image', imageFile); // Matches @RequestPart("image")
      }
      await axios.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/admin/product');
      router.refresh();
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { global: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard title="Add New Product">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  error={!!errors.name}
                  hint={errors.name}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(v) => setFormData((p) => ({ ...p, description: v }))}
                />
              </div>
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
                  value={formData.categoryId}
                  onChange={(v) => setFormData((p) => ({ ...p, categoryId: v }))}
                />
              </div>
              <div>
                <Label htmlFor="brandId">Brand *</Label>
                <Select
                  id="brandId"
                  name="brandId"
                  options={brands.map((b) => ({ value: b.id.toString(), label: b.name }))}
                  value={formData.brandId}
                  onChange={(v) => setFormData((p) => ({ ...p, brandId: v }))}
                />
              </div>
            </div>
          </div>

          {/* Jewelry Details */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold mb-4">Jewelry Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="specifications.material"
                  name="specifications.material"
                  value={formData.specifications.material}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="purity">Purity</Label>
                <Input
                  id="purity"
                  name="specifications.purity"
                  value={formData.specifications.purity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="stone_type">Stone</Label>
                <Input
                  id="stone_type"
                  name="specifications.stone_type"
                  value={formData.specifications.stone_type}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="hypoallergenic"
                  name="specifications.hypoallergenic"
                  checked={formData.specifications.hypoallergenic}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-500 rounded"
                />
                <Label htmlFor="hypoallergenic" className="ml-2 mb-0">
                  Hypoallergenic
                </Label>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold mb-4">Inventory & Variant</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="variantName">Variant Name (e.g. Small, Gold)</Label>
                <Input
                  id="variantName"
                  name="variantName"
                  value={formData.variantName}
                  onChange={handleChange}
                  placeholder="Medium Silver Hoops"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  error={!!errors.sku}
                  hint={errors.sku}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Compare at Price (Original Price)</Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Your Custom Drag & Drop Section */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Upload Image</Label>
                <FileInput onChange={handleFileChange} />
                {imageFile && <p className="text-sm text-brand-500 mt-2">File: {imageFile.name}</p>}
              </div>
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  placeholder="Image description"
                />
              </div>
              {/* Images Section */}
              {/*<div className="pb-6">*/}
              {/*  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">*/}
              {/*    Product Images*/}
              {/*  </h3>*/}
              {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
              {/*    <div>*/}
              {/*      <Label>Upload Image</Label>*/}
              {/*      <FileInput onChange={handleFileChange} />*/}
              {/*      {imageFile && (*/}
              {/*        <p className="text-sm text-brand-500 mt-2">File: {imageFile.name}</p>*/}
              {/*      )}*/}
              {/*    </div>*/}
              {/*    <div className="md:col-span-2">*/}
              {/*      <Label>Drag & Drop Upload</Label>*/}
              {/*      <div*/}
              {/*        {...getRootProps()}*/}
              {/*        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${isDragActive ? 'border-brand-500 bg-gray-50' : 'border-gray-300'}`}*/}
              {/*      >*/}
              {/*        <input {...getInputProps()} />*/}
              {/*        <p className="text-gray-500">*/}
              {/*          {isDragActive*/}
              {/*            ? 'Drop files here'*/}
              {/*            : 'Drag & drop image here, or click to browse'}*/}
              {/*        </p>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="md:col-span-2">
                <Label>Drag & Drop Upload</Label>
                <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                  <div
                    {...getRootProps()}
                    className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                      ${isDragActive ? 'border-brand-500 bg-gray-100 dark:bg-gray-800' : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'}
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="dz-message flex flex-col items-center m-0!">
                      <div className="mb-[22px] flex justify-center">
                        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                          <svg
                            className="fill-current"
                            width="29"
                            height="28"
                            viewBox="0 0 29 28"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                        {isDragActive ? 'Drop Files Here' : 'Drag & Drop Files Here'}
                      </h4>
                      <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                        Drag and drop your images here or browse
                      </span>
                      <span className="font-medium underline text-theme-sm text-brand-500">
                        Browse File
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Product'}
            </button>
          </div>
        </div>
      </ComponentCard>
    </form>
  );
}
