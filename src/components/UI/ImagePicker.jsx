import React, { useRef } from 'react';
import { ArticleFormIcons } from '../../data/Icons';
import LazyImage from './LazyImage';

const Icons = ArticleFormIcons;

const ImagePicker = ({
  imagePreview,
  onImageChange,
  error,
  isRTL = true,
  label = 'تصویر'
}) => {
  const imageInputRef = useRef(null);

  const handleViewImage = (e, imageUrl) => {
    e.stopPropagation();
    window.open(imageUrl, '_blank');
  };

  const handleChangeImage = (e) => {
    e.stopPropagation();
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {label} *
      </label>
      <div
        className={`w-full h-[25rem] rounded-lg border-2 ${
          error ? 'border-quaternary' : 'border-quinary-tint-500'
        } relative overflow-hidden cursor-pointer group`}
        onClick={handleChangeImage}
      >
        {imagePreview ? (
          <>
            <LazyImage
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-70"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
                  onClick={(e) => handleViewImage(e, imagePreview)}
                >
                  <Icons.View className="text-white text-xl" />
                </button>
                <button
                  type="button"
                  className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
                  onClick={handleChangeImage}
                >
                  <Icons.Edit className="text-white text-xl" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-quinary-tint-600 hover:bg-quinary-tint-500 transition-colors duration-300">
            <Icons.Add className="text-secondary text-4xl mb-2" />
            <span className="text-secondary">انتخاب تصویر</span>
          </div>
        )}
        <input
          type="file"
          ref={imageInputRef}
          onChange={onImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1 self-start">{error}</div>}
    </div>
  );
};

export default ImagePicker; 