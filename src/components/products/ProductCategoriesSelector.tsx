'use client';

import { useState, useEffect } from 'react';

interface ProductCategoriesSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function ProductCategoriesSelector({
  selectedIds,
  onChange,
}: ProductCategoriesSelectorProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.filter((c: any) => c.isActive));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleCategory = (categoryId: number) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  if (loading) {
    return <p className="text-sm text-bodydark">Зареждане на категории...</p>;
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-bodydark">
        Няма налични категории. Добавете категории първо.
      </p>
    );
  }

  return (
    <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-stroke p-4 dark:border-strokedark">
      {categories.map((category) => (
        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.includes(category.id)}
            onChange={() => toggleCategory(category.id)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-black dark:text-white">{category.name}</span>
        </label>
      ))}
    </div>
  );
}
