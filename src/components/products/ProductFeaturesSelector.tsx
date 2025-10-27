'use client';

import { useState, useEffect } from 'react';

interface ProductFeature {
  featureId: number;
  featureName?: string;
  value: string;
}

interface ProductFeaturesSelectorProps {
  selectedFeatures: ProductFeature[];
  onChange: (features: ProductFeature[]) => void;
}

export default function ProductFeaturesSelector({
  selectedFeatures,
  onChange,
}: ProductFeaturesSelectorProps) {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/features')
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.filter((f: any) => f.isActive));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addFeature = () => {
    if (features.length === 0) return;
    const firstAvailableFeature = features.find(
      (f) => !selectedFeatures.some((sf) => sf.featureId === f.id)
    );
    if (!firstAvailableFeature) return;

    onChange([
      ...selectedFeatures,
      {
        featureId: firstAvailableFeature.id,
        featureName: firstAvailableFeature.name,
        value: '',
      },
    ]);
  };

  const removeFeature = (index: number) => {
    onChange(selectedFeatures.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, featureId: number, value: string) => {
    const feature = features.find((f) => f.id === featureId);
    const updatedFeatures = [...selectedFeatures];
    updatedFeatures[index] = {
      featureId,
      featureName: feature?.name,
      value,
    };
    onChange(updatedFeatures);
  };

  if (loading) {
    return <p className="text-sm text-bodydark">Зареждане на характеристики...</p>;
  }

  if (features.length === 0) {
    return (
      <p className="text-sm text-bodydark">
        Няма налични характеристики. Добавете характеристики първо.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {selectedFeatures.map((feature, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex-1">
            <select
              value={feature.featureId}
              onChange={(e) =>
                updateFeature(index, parseInt(e.target.value), feature.value)
              }
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            >
              {features.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={feature.value}
              onChange={(e) =>
                updateFeature(index, feature.featureId, e.target.value)
              }
              placeholder="Стойност"
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          <button
            type="button"
            onClick={() => removeFeature(index)}
            className="text-red-500 hover:underline"
          >
            Премахни
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addFeature}
        disabled={selectedFeatures.length >= features.length}
        className="inline-flex items-center justify-center rounded-lg border border-stroke py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 transition"
      >
        + Добави характеристика
      </button>
    </div>
  );
}
