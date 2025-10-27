import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { products } from '@/db/schema';
import ProductsTable from '@/components/products/ProductsTable';

export const metadata: Metadata = {
  title: 'Продукти | Admin',
  description: 'Управление на продукти',
};

export default async function ProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Продукти
        </h2>
        <nav>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
          >
            Добави продукт
          </Link>
        </nav>
      </div>

      <ProductsTable initialProducts={allProducts} />
    </div>
  );
}
