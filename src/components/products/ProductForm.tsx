'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductBasicTab from './tabs/ProductBasicTab';
import ProductQuantityTab from './tabs/ProductQuantityTab';
import ProductDeliveryTab from './tabs/ProductDeliveryTab';
import ProductPricingTab from './tabs/ProductPricingTab';
import ProductSeoTab from './tabs/ProductSeoTab';
import ProductOptionsTab from './tabs/ProductOptionsTab';

interface ProductFormProps {
  product?: any;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Форм данни
  const [formData, setFormData] = useState({
    // Основни данни
    reference: product?.reference || '',
    name: product?.name || '',
    slug: product?.slug || '',
    shortDescription: product?.shortDescription || '',
    longDescription: product?.longDescription || '',
    brandId: product?.brandId || null,
    defaultCategoryId: product?.defaultCategoryId || null,
    hasVariations: product?.hasVariations || false,

    // Ценообразуване
    priceWithVat: product?.priceWithVat || '',
    priceWithoutVat: product?.priceWithoutVat || '',
    costPrice: product?.costPrice || '',

    // Размери и тегло
    width: product?.width || '',
    height: product?.height || '',
    depth: product?.depth || '',
    weight: product?.weight || '',
    deliveryTime: product?.deliveryTime || '',

    // SEO
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    canonicalUrl: product?.canonicalUrl || '',

    // Опции
    visibility: product?.visibility || 'visible',
    supplierId: product?.supplierId || null,
    isActive: product?.isActive !== undefined ? product.isActive : true,

    // Свързани данни
    images: product?.images || [],
    categoryIds: product?.categories?.map((c: any) => c.categoryId) || [],
    features: product?.features || [],
    stockByWarehouse: product?.stock || [],
  });

  const tabs = [
    { id: 0, label: 'Основни настройки', icon: '📝' },
    { id: 1, label: 'Количества', icon: '📦' },
    { id: 2, label: 'Доставка', icon: '🚚' },
    { id: 3, label: 'Ценообразуване', icon: '💰' },
    { id: 4, label: 'SEO', icon: '🔍' },
    { id: 5, label: 'Опции', icon: '⚙️' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при запазване');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Табове навигация */}
      <div className="mb-6 border-b border-stroke dark:border-strokedark">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-body hover:text-brand-500'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Съдържание на табовете */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        {activeTab === 0 && (
          <ProductBasicTab formData={formData} updateFormData={updateFormData} />
        )}
        {activeTab === 1 && (
          <ProductQuantityTab formData={formData} updateFormData={updateFormData} />
        )}
        {activeTab === 2 && (
          <ProductDeliveryTab formData={formData} updateFormData={updateFormData} />
        )}
        {activeTab === 3 && (
          <ProductPricingTab formData={formData} updateFormData={updateFormData} />
        )}
        {activeTab === 4 && (
          <ProductSeoTab formData={formData} updateFormData={updateFormData} />
        )}
        {activeTab === 5 && (
          <ProductOptionsTab formData={formData} updateFormData={updateFormData} />
        )}
      </div>

      {/* Бутони за запис */}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Запазване...' : 'Запази продукт'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="inline-flex items-center justify-center rounded-lg border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 transition"
        >
          Отказ
        </button>
      </div>
    </form>
  );
}
