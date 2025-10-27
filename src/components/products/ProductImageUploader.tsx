'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
  imageUrl: string;
  altText?: string;
  position?: number;
  isPrimary?: boolean;
}

interface ProductImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage: ProductImage = {
      imageUrl: newImageUrl.trim(),
      altText: newAltText.trim() || undefined,
      position: images.length,
      isPrimary: images.length === 0, // Първото изображение е основно по подразбиране
    };

    onChange([...images, newImage]);
    setNewImageUrl('');
    setNewAltText('');
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Ако изтриваме основното изображение и има други, направи първото основно
    if (images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    onChange(updatedImages);
  };

  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updatedImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedImages = [...images];
    [updatedImages[index], updatedImages[newIndex]] = [
      updatedImages[newIndex],
      updatedImages[index],
    ];

    // Обнови позициите
    updatedImages.forEach((img, i) => {
      img.position = i;
    });

    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Списък с добавени изображения */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg border border-stroke p-3 dark:border-strokedark"
            >
              {/* Бадж за основно изображение */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 z-10 rounded bg-brand-500 px-2 py-1 text-xs text-white">
                  Основно
                </div>
              )}

              {/* Изображение */}
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded bg-gray-100">
                <Image
                  src={image.imageUrl}
                  alt={image.altText || 'Product image'}
                  fill
                  className="object-contain"
                />
              </div>

              {/* ALT текст */}
              {image.altText && (
                <p className="mb-2 text-sm text-bodydark">{image.altText}</p>
              )}

              {/* Бутони */}
              <div className="flex flex-wrap gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className="text-xs text-brand-500 hover:underline"
                  >
                    Направи основно
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className="text-xs text-bodydark hover:underline disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className="text-xs text-bodydark hover:underline disabled:opacity-50"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Премахни
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Форма за добавяне на ново изображение */}
      <div className="rounded-lg border border-dashed border-stroke p-4 dark:border-strokedark">
        <h4 className="mb-3 font-medium text-black dark:text-white">
          Добави ново изображение
        </h4>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              URL на изображението
            </label>
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              ALT текст (за SEO)
            </label>
            <input
              type="text"
              value={newAltText}
              onChange={(e) => setNewAltText(e.target.value)}
              placeholder="Описание на изображението"
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          <button
            type="button"
            onClick={addImage}
            disabled={!newImageUrl.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 py-2 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition"
          >
            Добави изображение
          </button>
        </div>
      </div>
    </div>
  );
}
