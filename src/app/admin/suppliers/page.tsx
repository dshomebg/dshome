import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { suppliers } from '@/db/schema';
import SuppliersTable from '@/components/suppliers/SuppliersTable';

export const metadata: Metadata = {
  title: 'Доставчици | Admin',
  description: 'Управление на доставчици',
};

export default async function SuppliersPage() {
  const allSuppliers = await db.select().from(suppliers);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Доставчици
        </h2>
        <nav>
          <Link
            href="/admin/suppliers/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
          >
            Добави доставчик
          </Link>
        </nav>
      </div>

      <SuppliersTable initialSuppliers={allSuppliers} />
    </div>
  );
}
