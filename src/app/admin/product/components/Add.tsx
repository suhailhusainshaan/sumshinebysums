'use client';
import React, { useState } from 'react';
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
  onSubmit?: (data: any) => void;
}

export default function Add({ categories = [], brands = [], onSubmit }: DefaultInputsProps) {
  // Form state
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
      diameter: '',
      thickness: '',
      clasp_type: '',
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
    imageUrl: '',
    altText: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle nested objects (features, specifications, dimensions)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData((prev) => {
        // Create a safe copy of the parent object
        const parentObject = { ...(prev[parent as keyof typeof prev] as object) };

        return {
          ...prev,
          [parent]: {
            ...parentObject,
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
          },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // In a real app, you'd upload to cloud storage and get URL
      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file), // Temporary URL
      }));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setImageFile(acceptedFiles[0]);
      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(acceptedFiles[0]),
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
    maxFiles: 1,
  });

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.brandId) newErrors.brandId = 'Brand is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        brandId: parseInt(formData.brandId),
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        compareAtPrice: parseFloat(formData.compareAtPrice) || null,
        costPrice: parseFloat(formData.costPrice) || null,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        weight: parseFloat(formData.weight) || null,
        dimensions: {
          ...formData.dimensions,
          length: parseFloat(formData.dimensions.length) || null,
          width: parseFloat(formData.dimensions.width) || null,
          height: parseFloat(formData.dimensions.height) || null,
        },
      };

      onSubmit(submitData);
    }
  };

  // Options for selects
  const brandOptions = brands.map((brand) => ({
    value: brand.id.toString(),
    label: brand.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard title="Add New Product">
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Classic Silver Hoop Earrings"
                  error={!!errors.name}
                  hint={errors.name}
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-name"
                  hint="URL-friendly version of the name"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(value) =>
                    handleChange({ target: { name: 'description', value } } as any)
                  }
                  rows={4}
                  placeholder="Enter product description..."
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <div className="relative">
                  <Select
                    id="categoryId"
                    name="categoryId"
                    options={categoryOptions}
                    value={formData.categoryId}
                    onChange={handleSelectChange('categoryId')}
                    placeholder="Select category"
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
                {errors.categoryId && (
                  <p className="text-error-500 text-sm mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="brandId">Brand *</Label>
                <div className="relative">
                  <Select
                    id="brandId"
                    name="brandId"
                    options={brandOptions}
                    value={formData.brandId}
                    onChange={handleSelectChange('brandId')}
                    placeholder="Select brand"
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
                {errors.brandId && <p className="text-error-500 text-sm mt-1">{errors.brandId}</p>}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="features.material">Material</Label>
                <Input
                  id="features.material"
                  name="features.material"
                  type="text"
                  value={formData.features.material}
                  onChange={handleChange}
                  placeholder="e.g., 925 Sterling Silver"
                />
              </div>

              <div>
                <Label htmlFor="features.finish">Finish</Label>
                <Input
                  id="features.finish"
                  name="features.finish"
                  type="text"
                  value={formData.features.finish}
                  onChange={handleChange}
                  placeholder="e.g., High Polish"
                />
              </div>

              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="features.hypoallergenic"
                  name="features.hypoallergenic"
                  checked={formData.features.hypoallergenic}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                />
                <Label htmlFor="features.hypoallergenic" className="ml-2 mb-0">
                  Hypoallergenic
                </Label>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="specifications.diameter">Diameter</Label>
                <Input
                  id="specifications.diameter"
                  name="specifications.diameter"
                  type="text"
                  value={formData.specifications.diameter}
                  onChange={handleChange}
                  placeholder="e.g., 20mm"
                />
              </div>

              <div>
                <Label htmlFor="specifications.thickness">Thickness</Label>
                <Input
                  id="specifications.thickness"
                  name="specifications.thickness"
                  type="text"
                  value={formData.specifications.thickness}
                  onChange={handleChange}
                  placeholder="e.g., 2mm"
                />
              </div>

              <div>
                <Label htmlFor="specifications.clasp_type">Clasp Type</Label>
                <Input
                  id="specifications.clasp_type"
                  name="specifications.clasp_type"
                  type="text"
                  value={formData.specifications.clasp_type}
                  onChange={handleChange}
                  placeholder="e.g., Latch Back"
                />
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., SLV-HOOP-001-MED"
                  error={!!errors.sku}
                  hint={errors.sku}
                />
              </div>

              <div>
                <Label htmlFor="variantName">Variant Name</Label>
                <Input
                  id="variantName"
                  name="variantName"
                  type="text"
                  value={formData.variantName}
                  onChange={handleChange}
                  placeholder="e.g., Medium Silver Hoops"
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={!!errors.price}
                  hint={errors.price}
                />
              </div>

              <div>
                <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="costPrice">Cost Price ($)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="dimensions.length">Length (cm)</Label>
                <Input
                  id="dimensions.length"
                  name="dimensions.length"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="dimensions.width">Width (cm)</Label>
                <Input
                  id="dimensions.width"
                  name="dimensions.width"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.width}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="dimensions.height">Height (cm)</Label>
                <Input
                  id="dimensions.height"
                  name="dimensions.height"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="dimensions.unit">Unit</Label>
                <div className="relative">
                  <Select
                    id="dimensions.unit"
                    name="dimensions.unit"
                    options={[
                      { value: 'cm', label: 'Centimeters (cm)' },
                      { value: 'mm', label: 'Millimeters (mm)' },
                      { value: 'in', label: 'Inches (in)' },
                    ]}
                    value={formData.dimensions.unit}
                    onChange={handleSelectChange('dimensions.unit')}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Upload Image</Label>
                <FileInput onChange={handleFileChange} className="custom-class" />
                {imageFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  name="altText"
                  type="text"
                  value={formData.altText}
                  onChange={handleChange}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Drag & Drop Upload</Label>
                <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                  <div
                    {...getRootProps()}
                    className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                      ${
                        isDragActive
                          ? 'border-brand-500 bg-gray-100 dark:bg-gray-800'
                          : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                      }
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
                        Drag and drop your PNG, JPG, WebP, SVG images here or browse
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Add Product
            </button>
          </div>
        </div>
      </ComponentCard>
    </form>
  );
}
