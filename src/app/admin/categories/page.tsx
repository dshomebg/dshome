import Link from 'next/link';
import { db } from '@/db';
import { categories } from '@/db/schema';
import HierarchicalCategoriesTable from '@/components/categories/HierarchicalCategoriesTable';

export const metadata = {
  title: 'Категории | DSHOME Admin',
  description: 'Управление на категории',
};

export default async function CategoriesPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Категории
        </h2>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
        >
          <span className="text-xl">+</span>
          Добави категория
        </Link>
      </div>

      <HierarchicalCategoriesTable initialCategories={allCategories} />
    </div>
  );
}
