'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ProductImageUploader from '../ProductImageUploader';
import ProductFeaturesSelector from '../ProductFeaturesSelector';
import ProductCategoriesSelector from '../ProductCategoriesSelector';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface ProductBasicTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductBasicTab({ formData, updateFormData }: ProductBasicTabProps) {
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Зареди марките
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data.filter((b: any) => b.isActive)));

    // Зареди категориите
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.filter((c: any) => c.isActive)));
  }, []);

  // Генериране на slug от име (с кирилско-латинско транслитериране)
  const generateSlug = (name: string) => {
    const translitMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y',
      'ю': 'yu', 'я': 'ya',
    };

    return name
      .toLowerCase()
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    updateFormData({
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <div className="space-y-6">
      {/* Референция (задължително) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Референция <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.reference}
          onChange={(e) => updateFormData({ reference: e.target.value })}
          placeholder="SKU-12345"
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <p className="mt-1 text-sm text-bodydark">Уникален идентификатор на продукта</p>
      </div>

      {/* Име (задължително) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Име <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Име на продукта"
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
      </div>

      {/* Slug (автоматично генериран) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => updateFormData({ slug: e.target.value })}
          placeholder="product-slug"
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <p className="mt-1 text-sm text-bodydark">
          Автоматично генериран от името. Може да се редактира ръчно.
        </p>
      </div>

      {/* Изображения */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Изображения
        </label>
        <ProductImageUploader
          images={formData.images}
          onChange={(images) => updateFormData({ images })}
        />
      </div>

      {/* Кратко описание (WYSIWYG) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Кратко описание
        </label>
        <RichTextEditor
          content={formData.shortDescription}
          onChange={(content) => updateFormData({ shortDescription: content })}
          placeholder="Кратко описание на продукта..."
        />
      </div>

      {/* Дълго описание (WYSIWYG) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Дълго описание
        </label>
        <RichTextEditor
          content={formData.longDescription}
          onChange={(content) => updateFormData({ longDescription: content })}
          placeholder="Детайлно описание на продукта..."
        />
      </div>

      {/* Марка */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Марка
        </label>
        <select
          value={formData.brandId || ''}
          onChange={(e) =>
            updateFormData({
              brandId: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        >
          <option value="">Без марка</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Категории (многоизборно) */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Категории
        </label>
        <ProductCategoriesSelector
          selectedIds={formData.categoryIds}
          onChange={(categoryIds) => updateFormData({ categoryIds })}
        />
      </div>

      {/* Категория по подразбиране */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Основна категория
        </label>
        <select
          value={formData.defaultCategoryId || ''}
          onChange={(e) =>
            updateFormData({
              defaultCategoryId: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        >
          <option value="">Без основна категория</option>
          {categories
            .filter((cat) => formData.categoryIds.includes(cat.id))
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
        <p className="mt-1 text-sm text-bodydark">
          Изберете от категориите, добавени по-горе
        </p>
      </div>

      {/* Характеристики */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Характеристики
        </label>
        <ProductFeaturesSelector
          selectedFeatures={formData.features}
          onChange={(features) => updateFormData({ features })}
        />
      </div>

      {/* Продукт с комбинации */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasVariations}
            onChange={(e) => updateFormData({ hasVariations: e.target.checked })}
            className="sr-only"
          />
          <div className="relative">
            <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-meta-4"></div>
            <div
              className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                formData.hasVariations ? 'translate-x-6' : ''
              }`}
            ></div>
          </div>
          <span className="font-medium text-black dark:text-white">
            Продукт с комбинации
          </span>
        </label>
        <p className="mt-1 text-sm text-bodydark">
          Активирайте, ако продуктът има вариации (например различни цветове или размери)
        </p>
      </div>
    </div>
  );
}
