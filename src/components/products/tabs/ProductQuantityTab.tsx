'use client';

import { useState, useEffect } from 'react';

interface ProductQuantityTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductQuantityTab({
  formData,
  updateFormData,
}: ProductQuantityTabProps) {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Зареди складовете
    fetch('/api/warehouses')
      .then((res) => res.json())
      .then((data) => {
        const activeWarehouses = data.filter((w: any) => w.isActive);
        setWarehouses(activeWarehouses);

        // Ако няма наличности в formData, създай празни записи за всички складове
        if (!formData.stockByWarehouse || formData.stockByWarehouse.length === 0) {
          const initialStock = activeWarehouses.map((warehouse: any) => ({
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            quantity: 0,
          }));
          updateFormData({ stockByWarehouse: initialStock });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStock = (warehouseId: number, quantity: number) => {
    const updatedStock = formData.stockByWarehouse.map((stock: any) =>
      stock.warehouseId === warehouseId
        ? { ...stock, quantity }
        : stock
    );
    updateFormData({ stockByWarehouse: updatedStock });
  };

  const getTotalStock = () => {
    return formData.stockByWarehouse.reduce(
      (total: number, stock: any) => total + (stock.quantity || 0),
      0
    );
  };

  if (loading) {
    return <p className="text-bodydark">Зареждане на складове...</p>;
  }

  if (warehouses.length === 0) {
    return (
      <div className="rounded-lg border border-stroke bg-yellow-50 p-4 dark:border-strokedark dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Няма налични складове. Добавете складове първо, за да управлявате наличностите.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Обща наличност */}
      <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black dark:text-white">
            Обща наличност:
          </span>
          <span className="text-2xl font-bold text-brand-500">
            {getTotalStock()} бр.
          </span>
        </div>
      </div>

      {/* Наличности по складове */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-black dark:text-white">
          Наличности по складове
        </h3>
        <div className="space-y-3">
          {formData.stockByWarehouse?.map((stock: any) => {
            const warehouse = warehouses.find((w) => w.id === stock.warehouseId);
            return (
              <div
                key={stock.warehouseId}
                className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-strokedark"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-black dark:text-white">
                    {warehouse?.name || `Склад #${stock.warehouseId}`}
                  </h4>
                  {warehouse?.city && (
                    <p className="text-sm text-bodydark">{warehouse.city}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-bodydark">Количество:</label>
                  <input
                    type="number"
                    min="0"
                    value={stock.quantity || 0}
                    onChange={(e) =>
                      updateStock(stock.warehouseId, parseInt(e.target.value) || 0)
                    }
                    className="w-24 rounded-lg border border-stroke bg-transparent py-2 px-3 text-center outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
                  />
                  <span className="text-sm text-bodydark">бр.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Информация */}
      <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
        <p className="text-sm text-bodydark">
          <strong>Забележка:</strong> Наличностите се управляват отделно за всеки склад.
          Общата наличност е сумата от всички складове.
        </p>
      </div>
    </div>
  );
}
