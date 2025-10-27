'use client';

import { useState, useEffect } from 'react';

interface ProductOptionsTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductOptionsTab({
  formData,
  updateFormData,
}: ProductOptionsTabProps) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Зареди доставчиците
    fetch('/api/suppliers')
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data.filter((s: any) => s.isActive));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-black dark:text-white">
        Общи опции
      </h3>

      {/* Видимост */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Видимост
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="visible"
              checked={formData.visibility === 'visible'}
              onChange={(e) => updateFormData({ visibility: e.target.value })}
              className="h-4 w-4"
            />
            <span className="text-sm text-black dark:text-white">
              Видим навсякъде
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="hidden"
              checked={formData.visibility === 'hidden'}
              onChange={(e) => updateFormData({ visibility: e.target.value })}
              className="h-4 w-4"
            />
            <span className="text-sm text-black dark:text-white">
              Скрит (достъпен само чрез директен линк)
            </span>
          </label>
        </div>
        <p className="mt-2 text-sm text-bodydark">
          Контролирайте дали продуктът се показва в каталога и търсенето
        </p>
      </div>

      {/* Доставчик */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Доставчик
        </label>
        {loading ? (
          <p className="text-sm text-bodydark">Зареждане...</p>
        ) : (
          <select
            value={formData.supplierId || ''}
            onChange={(e) =>
              updateFormData({
                supplierId: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input sm:w-1/2"
          >
            <option value="">Без доставчик</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1 text-sm text-bodydark">
          Изберете доставчика на този продукт (за вътрешно ползване)
        </p>
      </div>

      {/* Активен статус */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Статус
        </label>
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => updateFormData({ isActive: e.target.checked })}
            className="sr-only"
          />
          <div className="relative">
            <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-meta-4"></div>
            <div
              className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                formData.isActive ? 'translate-x-6' : ''
              }`}
            ></div>
          </div>
          <span className="font-medium text-black dark:text-white">
            {formData.isActive ? 'Активен' : 'Неактивен'}
          </span>
        </label>
        <p className="mt-2 text-sm text-bodydark">
          Неактивните продукти не се показват на клиентите, но остават в системата
        </p>
      </div>

      {/* Информация */}
      <div className="rounded-lg border border-stroke bg-blue-50 p-4 dark:border-strokedark dark:bg-blue-900/20">
        <h4 className="mb-2 font-medium text-black dark:text-white">
          За какво служат тези опции?
        </h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-bodydark">
          <li>
            <strong>Видимост:</strong> Скритите продукти могат да се използват за
            специални оферти с директен линк
          </li>
          <li>
            <strong>Доставчик:</strong> Помага за управление на запасите и поръчките
          </li>
          <li>
            <strong>Статус:</strong> Деактивирайте продукти временно без да ги изтривате
          </li>
        </ul>
      </div>

      {/* Предупреждение при неактивен продукт */}
      {!formData.isActive && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h5 className="font-medium text-red-800 dark:text-red-200">
                Продуктът е неактивен
              </h5>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Този продукт няма да се показва на клиентите. Активирайте го, за да стане
                достъпен за покупка.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
