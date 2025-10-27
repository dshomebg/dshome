'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AttributeValue {
  value: string;
  colorCode?: string;
  position: number;
}

interface AttributeFormProps {
  attribute?: {
    id: number;
    name: string;
    type: string;
    position: number | null;
    isActive: boolean | null;
    values?: AttributeValue[];
  };
}

export default function AttributeForm({ attribute }: AttributeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: attribute?.name || '',
    type: attribute?.type || 'select',
    position: attribute?.position || 0,
    isActive: attribute?.isActive !== false,
  });
  const [values, setValues] = useState<AttributeValue[]>(
    attribute?.values || [{ value: '', colorCode: '', position: 0 }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addValue = () => {
    setValues([...values, { value: '', colorCode: '', position: values.length }]);
  };

  const removeValue = (index: number) => {
    if (values.length > 1) {
      setValues(values.filter((_, i) => i !== index));
    }
  };

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value };
    setValues(newValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = attribute ? `/api/attributes/${attribute.id}` : '/api/attributes';
      const method = attribute ? 'PUT' : 'POST';

      // Filter out empty values
      const filteredValues = values.filter(v => v.value.trim() !== '');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          values: filteredValues,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при запазване');
      }

      router.push('/admin/attributes');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при запазване на атрибут');
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
              Име на атрибут <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Напр. Цвят, Размер"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            />
          </div>

          {/* Тип */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Тип <span className="text-danger">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
            >
              <option value="select">Падащо меню (Select)</option>
              <option value="radio">Радио бутони (Radio)</option>
              <option value="color">Цвят (Color)</option>
            </select>
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

      {/* Стойности */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">Стойности</h3>
          <button
            type="button"
            onClick={addValue}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-2 px-4 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            Добави стойност
          </button>
        </div>
        <div className="p-6.5 space-y-4">
          {values.map((val, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={val.value}
                  onChange={(e) => updateValue(index, 'value', e.target.value)}
                  placeholder="Стойност"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                />
              </div>
              {formData.type === 'color' && (
                <div className="w-32">
                  <input
                    type="text"
                    value={val.colorCode || ''}
                    onChange={(e) => updateValue(index, 'colorCode', e.target.value)}
                    placeholder="#FFFFFF"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeValue(index)}
                disabled={values.length === 1}
                className="inline-flex items-center justify-center rounded-lg border border-stroke py-3 px-4 text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 transition disabled:opacity-50"
                title="Изтрий"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Бутони */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-10 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Запазване...' : attribute ? 'Обнови атрибут' : 'Създай атрибут'}
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
