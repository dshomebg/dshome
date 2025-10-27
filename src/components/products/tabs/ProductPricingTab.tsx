'use client';

import { useEffect, useState } from 'react';

interface ProductPricingTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductPricingTab({
  formData,
  updateFormData,
}: ProductPricingTabProps) {
  const VAT_RATE = 0.2; // 20% ДДС
  const [margin, setMargin] = useState(0);
  const [marginPercent, setMarginPercent] = useState(0);

  // Изчисли марж при промяна на цените
  useEffect(() => {
    if (formData.costPrice && formData.priceWithoutVat) {
      const cost = parseFloat(formData.costPrice) || 0;
      const price = parseFloat(formData.priceWithoutVat) || 0;
      const calculatedMargin = price - cost;
      const calculatedMarginPercent = cost > 0 ? (calculatedMargin / cost) * 100 : 0;
      setMargin(calculatedMargin);
      setMarginPercent(calculatedMarginPercent);
    }
  }, [formData.costPrice, formData.priceWithoutVat]);

  const handlePriceWithVatChange = (value: string) => {
    const priceWithVat = parseFloat(value) || 0;
    const priceWithoutVat = priceWithVat / (1 + VAT_RATE);
    updateFormData({
      priceWithVat: value,
      priceWithoutVat: priceWithoutVat.toFixed(2),
    });
  };

  const handlePriceWithoutVatChange = (value: string) => {
    const priceWithoutVat = parseFloat(value) || 0;
    const priceWithVat = priceWithoutVat * (1 + VAT_RATE);
    updateFormData({
      priceWithoutVat: value,
      priceWithVat: priceWithVat.toFixed(2),
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-black dark:text-white">
        Ценообразуване
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Цена с ДДС */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Цена с ДДС <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.priceWithVat || ''}
              onChange={(e) => handlePriceWithVatChange(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 pr-12 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bodydark">
              лв.
            </span>
          </div>
          <p className="mt-1 text-sm text-bodydark">Крайна цена за клиента</p>
        </div>

        {/* Цена без ДДС */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Цена без ДДС <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.priceWithoutVat || ''}
              onChange={(e) => handlePriceWithoutVatChange(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 pr-12 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bodydark">
              лв.
            </span>
          </div>
          <p className="mt-1 text-sm text-bodydark">Нето цена (без данък)</p>
        </div>
      </div>

      {/* Себестойност */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Себестойност
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.costPrice || ''}
            onChange={(e) => updateFormData({ costPrice: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 pr-12 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input sm:w-1/2"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bodydark sm:right-[calc(50%+1rem)]">
            лв.
          </span>
        </div>
        <p className="mt-1 text-sm text-bodydark">
          Вашата покупна цена (за вътрешно ползване)
        </p>
      </div>

      {/* Изчислен марж */}
      {formData.costPrice && formData.priceWithoutVat && (
        <div className="rounded-lg border border-stroke bg-brand-50 p-4 dark:border-strokedark dark:bg-brand-900/20">
          <h4 className="mb-3 font-medium text-black dark:text-white">
            Анализ на рентабилността
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-bodydark">Себестойност</p>
              <p className="text-xl font-bold text-black dark:text-white">
                {parseFloat(formData.costPrice).toFixed(2)} лв.
              </p>
            </div>
            <div>
              <p className="text-sm text-bodydark">Печалба</p>
              <p
                className={`text-xl font-bold ${
                  margin >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {margin.toFixed(2)} лв.
              </p>
            </div>
            <div>
              <p className="text-sm text-bodydark">Марж</p>
              <p
                className={`text-xl font-bold ${
                  marginPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {marginPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Информация за ДДС */}
      <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
        <h4 className="mb-2 font-medium text-black dark:text-white">
          Информация за ДДС
        </h4>
        <div className="space-y-1 text-sm text-bodydark">
          <p>
            <strong>ДДС ставка:</strong> {VAT_RATE * 100}%
          </p>
          {formData.priceWithVat && formData.priceWithoutVat && (
            <p>
              <strong>ДДС сума:</strong>{' '}
              {(
                parseFloat(formData.priceWithVat) -
                parseFloat(formData.priceWithoutVat)
              ).toFixed(2)}{' '}
              лв.
            </p>
          )}
        </div>
      </div>

      {/* Забележка */}
      <div className="rounded-lg border border-stroke bg-yellow-50 p-4 dark:border-strokedark dark:bg-yellow-900/20">
        <p className="text-sm text-bodydark">
          <strong>Забележка:</strong> Цените с и без ДДС се изчисляват автоматично едната
          от друга. Себестойността е незадължителна, но се препоръчва да я попълните за
          по-добър контрол върху рентабилността.
        </p>
      </div>
    </div>
  );
}
