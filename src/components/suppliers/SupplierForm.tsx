'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SupplierFormProps {
  supplier?: {
    id: number;
    name: string;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean | null;
  };
}

export default function SupplierForm({ supplier }: SupplierFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    notes: supplier?.notes || '',
    isActive: supplier?.isActive !== false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = supplier ? `/api/suppliers/${supplier.id}` : '/api/suppliers';
      const method = supplier ? 'PUT' : 'POST';

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

      router.push('/admin/suppliers');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при запазване на доставчик');
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
              Име на доставчик <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Напр. ООД Доставка"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Контактно лице */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Контактно лице</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Иван Иванов"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Имейл */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Имейл</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+359 888 123 456"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Адрес */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Адрес</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="гр. София, ул. Примерна 123"
              rows={2}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Бележки */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Бележки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Допълнителна информация..."
              rows={3}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Статус */}
          <div className="flex items-center gap-3">
            <label className="text-black dark:text-white">Активен</label>
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
          {isSubmitting ? 'Запазване...' : supplier ? 'Обнови доставчик' : 'Създай доставчик'}
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
