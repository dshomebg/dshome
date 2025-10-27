import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { features } from '@/db/schema';
import FeaturesTable from '@/components/features/FeaturesTable';

export const metadata: Metadata = {
  title: 'Характеристики | Admin',
  description: 'Управление на характеристики',
};

export default async function FeaturesPage() {
  const allFeatures = await db.select().from(features);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Характеристики
        </h2>
        <nav>
          <Link
            href="/admin/features/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
          >
            Добави характеристика
          </Link>
        </nav>
      </div>

      <FeaturesTable initialFeatures={allFeatures} />
    </div>
  );
}
