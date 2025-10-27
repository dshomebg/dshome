'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), {
  ssr: false,
  loading: () => <p className="text-gray-500">Зареждане на редактор...</p>
});

interface BrandFormProps {
  brand?: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isActive: boolean | null;
  };
}

export default function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    slug: brand?.slug || '',
    logoUrl: brand?.logoUrl || '',
    description: brand?.description || '',
    metaTitle: brand?.metaTitle || '',
    metaDescription: brand?.metaDescription || '',
    isActive: brand?.isActive !== false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transliterate = (text: string): string => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
      'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
      'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
      'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return text
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      name: newName,
      slug: transliterate(newName),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = brand ? `/api/brands/${brand.id}` : '/api/brands';
      const method = brand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при запазване');
      }

      router.push('/admin/brands');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при запазване на марка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основна информация */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Основна информация</h3>
        </div>
        <div className="p-6.5 space-y-4">
          {/* Име */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Име на марката <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Напр. Bosch"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              URL Slug <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="bosch"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Лого URL */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">URL на лого</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
            {formData.logoUrl && (
              <div className="mt-3 relative w-32 h-32">
                <Image
                  src={formData.logoUrl}
                  alt="Logo preview"
                  fill
                  className="object-contain rounded border border-stroke dark:border-strokedark"
                />
              </div>
            )}
          </div>

          {/* Статус */}
          <div className="flex items-center gap-3">
            <label className="text-black dark:text-white">Активна</label>
            <div>
              <label className="flex cursor-pointer select-none items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`block h-8 w-14 rounded-full transition ${formData.isActive ? 'bg-brand-500' : 'bg-meta-9 dark:bg-[#5A616B]'}`}></div>
                  <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${formData.isActive ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Описание */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Описание</h3>
        </div>
        <div className="p-6.5">
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Въведете описание на марката..."
          />
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">SEO настройки</h3>
        </div>
        <div className="p-6.5 space-y-4">
          {/* Meta Title */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Meta заглавие
              <span className="ml-2 text-sm text-gray-500">
                ({formData.metaTitle.length}/60)
              </span>
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO заглавие"
              maxLength={60}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Meta описание
              <span className="ml-2 text-sm text-gray-500">
                ({formData.metaDescription.length}/160)
              </span>
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="SEO описание"
              maxLength={160}
              rows={3}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Бутони */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-10 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Запазване...' : brand ? 'Обнови марка' : 'Създай марка'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-lg border border-stroke py-3 px-10 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 transition"
        >
          Отказ
        </button>
      </div>
    </form>
  );
}
