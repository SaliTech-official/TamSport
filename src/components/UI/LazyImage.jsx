import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div className={`${className} bg-quinary-tint-800 flex items-center justify-center`}>
        <span className="text-secondary">{t('imageNotProvided')}</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-quinary-tint-800 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-quaternary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default LazyImage; 