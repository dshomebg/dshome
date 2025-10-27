import { notFound } from 'next/navigation';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CategoryForm from '@/components/categories/CategoryForm';

export const metadata = {
  title: 'Редактиране на категория | DSHOME Admin',
  description: 'Редактиране на категория',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  if (category.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Редактиране на категория
        </h2>
      </div>

      <CategoryForm initialData={category[0]} isEdit={true} />
    </div>
  );
}
