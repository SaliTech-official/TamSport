import React, { useRef } from 'react';
import { ArticleFormIcons } from '../../data/Icons';

const Icons = ArticleFormIcons;

const SlideshowImages = ({
  images,
  onAddImage,
  onRemoveImage,
  onChangeImage,
  error,
}) => {
  const addImageInputRef = useRef(null);

  const handleAddClick = () => {
    if (addImageInputRef.current) {
      addImageInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <label className="block text-right text-[16px] text-secondary">
        تصاویر اسلایدشو
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="h-[150px] rounded-lg border-2 border-quinary-tint-500 relative overflow-hidden group"
          >
            <img
              src={image.preview}
              alt={`Slideshow image ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                  onClick={() => window.open(image.preview, '_blank')}
                >
                  <Icons.View className="text-white" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                  onClick={() => onChangeImage(index)}
                >
                  <Icons.Edit className="text-white" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                  onClick={() => onRemoveImage(index)}
                >
                  <Icons.Delete className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          className="h-[150px] rounded-lg border-2 border-dashed border-quinary-tint-500 relative overflow-hidden cursor-pointer hover:border-primary transition-colors duration-300 flex items-center justify-center"
          onClick={handleAddClick}
        >
          <div className="flex flex-col items-center justify-center">
            <Icons.Add className="text-secondary text-2xl mb-2" />
            <span className="text-secondary text-sm">افزودن تصویر</span>
          </div>
          <input
            type="file"
            ref={addImageInputRef}
            onChange={onAddImage}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
      </div>
      {error && (
        <p className="text-quaternary text-[14px] mt-1 text-right">{error}</p>
      )}
    </div>
  );
};

export default SlideshowImages; 