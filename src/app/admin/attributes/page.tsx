import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { attributes, attributeValues } from '@/db/schema';
import { eq } from 'drizzle-orm';
import AttributesTable from '@/components/attributes/AttributesTable';

export const metadata: Metadata = {
  title: 'Атрибути | Admin',
  description: 'Управление на атрибути',
};

export default async function AttributesPage() {
  const allAttributes = await db.select().from(attributes);

  // Fetch values for each attribute
  const attributesWithValues = await Promise.all(
    allAttributes.map(async (attr) => {
      const values = await db.select().from(attributeValues).where(eq(attributeValues.attributeId, attr.id));
      return { ...attr, values };
    })
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Атрибути
        </h2>
        <nav>
          <Link
            href="/admin/attributes/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-3 px-6 text-center font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
          >
            Добави атрибут
          </Link>
        </nav>
      </div>

      <AttributesTable initialAttributes={attributesWithValues} />
    </div>
  );
}
