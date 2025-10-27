'use client';

interface ProductDeliveryTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductDeliveryTab({
  formData,
  updateFormData,
}: ProductDeliveryTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-black dark:text-white">
        Размери и тегло
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Ширина */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Ширина (см)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.width || ''}
            onChange={(e) => updateFormData({ width: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        {/* Височина */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Височина (см)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.height || ''}
            onChange={(e) => updateFormData({ height: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        {/* Дълбочина */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Дълбочина (см)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.depth || ''}
            onChange={(e) => updateFormData({ depth: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        {/* Тегло */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Тегло (кг)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.weight || ''}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
      </div>

      {/* Срок за доставка */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Срок за доставка
        </label>
        <input
          type="text"
          value={formData.deliveryTime || ''}
          onChange={(e) => updateFormData({ deliveryTime: e.target.value })}
          placeholder="Напр: 1-2 работни дни, 3-5 дни, На склад и т.н."
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <p className="mt-1 text-sm text-bodydark">
          Информация за клиентите относно очаквания срок за доставка
        </p>
      </div>

      {/* Визуализация на обема */}
      {(formData.width || formData.height || formData.depth) && (
        <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
          <h4 className="mb-2 font-medium text-black dark:text-white">
            Обобщение
          </h4>
          <div className="space-y-1 text-sm text-bodydark">
            {formData.width && formData.height && formData.depth && (
              <p>
                <strong>Обем:</strong>{' '}
                {(
                  parseFloat(formData.width) *
                  parseFloat(formData.height) *
                  parseFloat(formData.depth) /
                  1000000
                ).toFixed(4)}{' '}
                m³
              </p>
            )}
            {formData.weight && (
              <p>
                <strong>Тегло:</strong> {formData.weight} кг
              </p>
            )}
          </div>
        </div>
      )}

      {/* Информация */}
      <div className="rounded-lg border border-stroke bg-yellow-50 p-4 dark:border-strokedark dark:bg-yellow-900/20">
        <p className="text-sm text-bodydark">
          <strong>Забележка:</strong> Размерите и теглото се използват за изчисляване на
          транспортните разходи. Ако продуктът има вариации, можете да зададете допълнително
          влияние върху теглото за всяка вариация.
        </p>
      </div>
    </div>
  );
}
