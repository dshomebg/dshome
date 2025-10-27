'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeatureFormProps {
  feature?: {
    id: number;
    name: string;
    position: number | null;
    isActive: boolean | null;
  };
}

export default function FeatureForm({ feature }: FeatureFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: feature?.name || '',
    position: feature?.position || 0,
    isActive: feature?.isActive !== false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = feature ? `/api/features/${feature.id}` : '/api/features';
      const method = feature ? 'PUT' : 'POST';

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

      router.push('/admin/features');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при запазване на характеристика');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Основна информация</h3>
        </div>
        <div className="p-6.5 space-y-4">
          {/* Име */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Име на характеристика <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Напр. Процесор, Мощност, Размери"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Позиция */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Позиция</label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              placeholder="0"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
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

      {/* Бутони */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-10 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Запазване...' : feature ? 'Обнови характеристика' : 'Създай характеристика'}
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
