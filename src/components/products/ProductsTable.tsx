'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductsTableProps {
  initialProducts: any[];
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleDelete = async (id: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този продукт?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Грешка при изтриване');
      }

      setProducts(products.filter((p) => p.id !== id));
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Филтриране
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Филтри */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Търси по име или референция..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="all">Всички</option>
            <option value="active">Активни</option>
            <option value="inactive">Неактивни</option>
          </select>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Изображение
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Референция
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Име
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Цена
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Марка
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Статус
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-bodydark">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Няма намерени продукти'
                    : 'Няма добавени продукти'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-stroke dark:border-strokedark">
                  {/* Изображение */}
                  <td className="px-4 py-5">
                    <div className="relative h-16 w-16 overflow-hidden rounded bg-gray-100">
                      {product.primaryImage ? (
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-bodydark">
                          Без снимка
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Референция */}
                  <td className="px-4 py-5">
                    <p className="font-medium text-black dark:text-white">
                      {product.reference}
                    </p>
                  </td>

                  {/* Име */}
                  <td className="px-4 py-5">
                    <p className="text-black dark:text-white">{product.name}</p>
                    {product.hasVariations && (
                      <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        С вариации
                      </span>
                    )}
                  </td>

                  {/* Цена */}
                  <td className="px-4 py-5">
                    <p className="font-medium text-black dark:text-white">
                      {parseFloat(product.priceWithVat).toFixed(2)} лв.
                    </p>
                    <p className="text-xs text-bodydark">
                      без ДДС: {parseFloat(product.priceWithoutVat).toFixed(2)} лв.
                    </p>
                  </td>

                  {/* Марка */}
                  <td className="px-4 py-5">
                    <p className="text-sm text-bodydark">
                      {product.brandName || '-'}
                    </p>
                  </td>

                  {/* Статус */}
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {product.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                      {product.visibility === 'hidden' && (
                        <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Скрит
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Действия */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-brand-500 hover:underline"
                      >
                        Редактирай
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:underline"
                      >
                        Изтрий
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Обобщение */}
      <div className="mt-4 flex items-center justify-between text-sm text-bodydark">
        <p>
          Показани: {filteredProducts.length} от {products.length} продукта
        </p>
      </div>
    </div>
  );
}
