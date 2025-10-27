import CategoryForm from '@/components/categories/CategoryForm';

export const metadata = {
  title: 'Добави категория | DSHOME Admin',
  description: 'Добавяне на нова категория',
};

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Добави нова категория
        </h2>
      </div>

      <CategoryForm />
    </div>
  );
}
