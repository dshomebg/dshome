'use client';

interface ProductSeoTabProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export default function ProductSeoTab({ formData, updateFormData }: ProductSeoTabProps) {
  const metaTitleLength = formData.metaTitle?.length || 0;
  const metaDescriptionLength = formData.metaDescription?.length || 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-black dark:text-white">
        SEO оптимизация
      </h3>

      {/* Meta Title */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Meta Title (Заглавие за търсачки)
        </label>
        <input
          type="text"
          value={formData.metaTitle || ''}
          onChange={(e) => updateFormData({ metaTitle: e.target.value })}
          placeholder="Оставете празно, за да се използва името на продукта"
          maxLength={70}
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <div className="mt-1 flex items-center justify-between text-sm">
          <p className="text-bodydark">
            Препоръчва се: 50-60 символа
          </p>
          <p
            className={`font-medium ${
              metaTitleLength > 60
                ? 'text-red-500'
                : metaTitleLength > 50
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {metaTitleLength} / 70
          </p>
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Meta Description (Описание за търсачки)
        </label>
        <textarea
          value={formData.metaDescription || ''}
          onChange={(e) => updateFormData({ metaDescription: e.target.value })}
          placeholder="Кратко описание на продукта за резултатите в търсачките"
          maxLength={160}
          rows={3}
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <div className="mt-1 flex items-center justify-between text-sm">
          <p className="text-bodydark">
            Препоръчва се: 120-160 символа
          </p>
          <p
            className={`font-medium ${
              metaDescriptionLength > 160
                ? 'text-red-500'
                : metaDescriptionLength > 120
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {metaDescriptionLength} / 160
          </p>
        </div>
      </div>

      {/* Canonical URL */}
      <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Canonical URL
        </label>
        <input
          type="url"
          value={formData.canonicalUrl || ''}
          onChange={(e) => updateFormData({ canonicalUrl: e.target.value })}
          placeholder="https://example.com/products/product-slug"
          className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
        />
        <p className="mt-1 text-sm text-bodydark">
          Оставете празно, за да се генерира автоматично от slug. Използвайте само при
          необходимост от custom URL.
        </p>
      </div>

      {/* URL Preview */}
      <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
        <h4 className="mb-3 font-medium text-black dark:text-white">
          Преглед как ще изглежда в Google
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <p className="text-sm text-bodydark">yoursite.com</p>
          </div>
          <h5 className="text-lg font-medium text-brand-600 hover:underline cursor-pointer">
            {formData.metaTitle || formData.name || 'Име на продукта'}
          </h5>
          <p className="text-sm text-green-700 dark:text-green-400">
            https://yoursite.com/products/{formData.slug || 'product-slug'}
          </p>
          <p className="text-sm text-bodydark">
            {formData.metaDescription ||
              formData.shortDescription ||
              'Кратко описание на продукта за резултатите в търсачките...'}
          </p>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-3 font-medium text-black dark:text-white">
          SEO Checklist
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                formData.name ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              {formData.name ? '✓' : '○'}
            </div>
            <p className="text-sm text-bodydark">Име на продукта е попълнено</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                formData.slug ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              {formData.slug ? '✓' : '○'}
            </div>
            <p className="text-sm text-bodydark">URL slug е генериран</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                metaTitleLength >= 50 && metaTitleLength <= 60
                  ? 'bg-green-500'
                  : metaTitleLength > 0
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            >
              {metaTitleLength > 0 ? '✓' : '○'}
            </div>
            <p className="text-sm text-bodydark">
              Meta title е в оптималния диапазон (50-60 символа)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                metaDescriptionLength >= 120 && metaDescriptionLength <= 160
                  ? 'bg-green-500'
                  : metaDescriptionLength > 0
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            >
              {metaDescriptionLength > 0 ? '✓' : '○'}
            </div>
            <p className="text-sm text-bodydark">
              Meta description е в оптималния диапазон (120-160 символа)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                formData.images?.length > 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              {formData.images?.length > 0 ? '✓' : '○'}
            </div>
            <p className="text-sm text-bodydark">Има добавени изображения</p>
          </div>
        </div>
      </div>
    </div>
  );
}
