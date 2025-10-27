'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  isActive?: boolean;
  createdAt: Date | null;
}

interface CategoriesTableProps {
  initialCategories: Category[];
}

export default function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Намиране на име на родителска категория
  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return '-';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази категория?')) {
      return;
    }

    setIsDeleting(id);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при изтриване');
      }

      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при изтриване на категория');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Всички категории
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                ID
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Име
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Slug
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Родител
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Статус
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Създадена
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 px-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Няма създадени категории
                  </p>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">{category.id}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">{category.name}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.slug}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getParentName(category.parentId)}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        category.isActive
                          ? 'bg-success bg-opacity-10 text-success'
                          : 'bg-danger bg-opacity-10 text-danger'
                      }`}
                    >
                      {category.isActive ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">
                      {formatDate(category.createdAt)}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center space-x-3.5">
                      <Link
                        href={`/admin/categories/edit/${category.id}`}
                        className="hover:text-brand-500"
                        title="Редактирай"
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
                            d="M16.1999 5.93005L12.0699 1.80005C11.9774 1.70742 11.8676 1.63399 11.7468 1.58405C11.626 1.53411 11.4967 1.50867 11.3662 1.50928C11.2356 1.50989 11.1066 1.53653 10.9863 1.58761C10.866 1.63869 10.7569 1.71319 10.6652 1.80693C10.5735 1.90067 10.5013 2.0119 10.4527 2.13368C10.4042 2.25547 10.3802 2.38545 10.3821 2.51606C10.384 2.64666 10.4118 2.77593 10.4638 2.89631C10.5159 3.01669 10.5911 3.12581 10.6852 3.21693L13.4699 6.00005H1.49995C1.23473 6.00005 0.980323 6.10541 0.792787 6.29294C0.605251 6.48048 0.499951 6.73483 0.499951 7.00005C0.499951 7.26527 0.605251 7.51962 0.792787 7.70716C0.980323 7.8947 1.23473 8.00005 1.49995 8.00005H13.4699L10.6852 10.7851C10.4977 10.9726 10.3924 11.227 10.3924 11.4922C10.3924 11.7575 10.4977 12.0119 10.6852 12.1994C10.8727 12.3869 11.1271 12.4922 11.3924 12.4922C11.6576 12.4922 11.912 12.3869 12.0995 12.1994L16.2295 8.06943C16.5528 7.74613 16.7344 7.30638 16.7344 6.84693C16.7344 6.38747 16.5528 5.94772 16.2295 5.62443L16.1999 5.93005Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="hover:text-danger disabled:opacity-50"
                        title="Изтрий"
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
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
