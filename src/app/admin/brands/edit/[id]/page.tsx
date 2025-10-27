import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BrandForm from '@/components/brands/BrandForm';

export const metadata: Metadata = {
  title: 'Редактиране на марка | Admin',
  description: 'Редактиране на марка',
};

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await db.select().from(brands).where(eq(brands.id, parseInt(id)));

  if (brand.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Редактиране на марка
        </h2>
        <nav>
          <Link
            href="/admin/brands"
            className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 transition"
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
                d="M15 8.25H4.8675L9.5175 3.6C9.825 3.2925 9.825 2.7075 9.5175 2.4C9.21 2.0925 8.625 2.0925 8.3175 2.4L2.4 8.3175C2.0925 8.625 2.0925 9.21 2.4 9.5175L8.3175 15.435C8.625 15.7425 9.21 15.7425 9.5175 15.435C9.825 15.1275 9.825 14.5425 9.5175 14.235L4.8675 9.75H15C15.4125 9.75 15.75 9.4125 15.75 9C15.75 8.5875 15.4125 8.25 15 8.25Z"
                fill=""
              />
            </svg>
            Назад
          </Link>
        </nav>
      </div>

      <BrandForm brand={brand[0]} />
    </div>
  );
}
