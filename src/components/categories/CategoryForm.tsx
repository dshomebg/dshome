'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import за да избегнем SSR проблеми с TipTap
const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), {
  ssr: false,
  loading: () => <p className="text-gray-500">Зареждане на редактор...</p>
});

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

interface CategoryFormProps {
  initialData?: Category;
  isEdit?: boolean;
}

export default function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    parentId: initialData?.parentId || null as number | null,
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Зареждане на всички категории за dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Филтрираме текущата категория при редакция
          const filtered = isEdit && initialData
            ? data.filter((cat: Category) => cat.id !== initialData.id)
            : data;
          setAllCategories(filtered);
        }
      } catch (error) {
        console.error('Грешка при зареждане на категории:', error);
      }
    };
    fetchCategories();
  }, [isEdit, initialData]);

  // Транслитерация от кирилица към латиница (българска)
  const transliterate = (text: string): string => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y',
      'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh',
      'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
      'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y',
      'Ю': 'Yu', 'Я': 'Ya'
    };

    return text
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('');
  };

  const generateSlug = (name: string) => {
    return transliterate(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/categories/${initialData?.id}`
        : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Грешка при запазване');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при запазване на категория');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {isEdit ? 'Редактиране на категория' : 'Добавяне на нова категория'}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          {error && (
            <div className="mb-4 rounded-lg bg-danger bg-opacity-10 px-4 py-3 text-danger">
              {error}
            </div>
          )}

          {/* Име на категория */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Име на категория <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Въведете име на категория"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
            />
          </div>

          {/* Slug */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              URL адрес (Slug) <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="category-slug"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
            />
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Генерира се автоматично от името, но може да се промени ръчно
            </p>
          </div>

          {/* Статус (Toggle Switch) */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Статус
            </label>
            <div className="flex items-center">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-brand-800"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {formData.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </label>
            </div>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Активните категории са видими в онлайн магазина
            </p>
          </div>

          {/* Родителска категория */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Родителска категория
            </label>
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
            >
              <option value="">Няма (Категория от първо ниво)</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Изберете родителска категория за да създадете подкатегория
            </p>
          </div>

          {/* Описание */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Описание
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Описание на категорията..."
            />
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Използвайте бутона с "&lt;/&gt;" за HTML изглед
            </p>
          </div>

          {/* URL на изображение */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              URL на изображение
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-32 w-auto rounded border border-stroke object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Въведете URL адрес на изображение или го качете (функционалност скоро)
            </p>
          </div>

          {/* SEO Секция */}
          <div className="mb-6 border-t border-stroke pt-6 dark:border-strokedark">
            <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
              SEO Оптимизация
            </h4>

            {/* Meta Title */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Мета заглавие
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO заглавие за категорията"
                maxLength={60}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
              />
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Препоръчителна дължина: до 60 символа ({formData.metaTitle.length}/60)
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Мета описание
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO описание за категорията"
                rows={3}
                maxLength={160}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-brand-500"
              />
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Препоръчителна дължина: до 160 символа ({formData.metaDescription.length}/160)
              </p>
            </div>
          </div>

          {/* Бутони */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center rounded-lg bg-brand-500 py-3 px-6 font-medium text-white shadow-theme-xs hover:bg-brand-600 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Запазване...' : isEdit ? 'Обнови категория' : 'Създай категория'}
            </button>

            <Link
              href="/admin/categories"
              className="flex justify-center rounded-lg border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Отказ
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
