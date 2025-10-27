import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { brands } from '@/db/schema';
import BrandsTable from '@/components/brands/BrandsTable';

export const metadata: Metadata = {
  title: 'Марки | Admin',
  description: 'Управление на марки',
};

export default async function BrandsPage() {
  const allBrands = await db.select().from(brands);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Марки
        </h2>
        <nav>
          <Link
            href="/admin/brands/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
          >
            Добави марка
          </Link>
        </nav>
      </div>

      <BrandsTable initialBrands={allBrands} />
    </div>
  );
}
