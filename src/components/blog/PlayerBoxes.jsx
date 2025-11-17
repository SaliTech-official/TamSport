import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHome } from '../../context/HomeContext';
import LazyImage from '../UI/LazyImage';

const PlayerBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { homeData } = useHome();
  const totalSlides = Math.ceil(homeData.players.length / 5);
  const slidesPerView = 5;

  useEffect(() => {
    const handlePrevSlide = () => {
      setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    const handleNextSlide = () => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    };

    document.addEventListener('prevSlide', handlePrevSlide);
    document.addEventListener('nextSlide', handleNextSlide);

    return () => {
      document.removeEventListener('prevSlide', handlePrevSlide);
      document.removeEventListener('nextSlide', handleNextSlide);
    };
  }, [totalSlides]);

  // Reset slide when language changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [i18n.language]);

  // Calculate transform for slide
  const getTransform = () => {
    const slideWidth = 220;
    const offset = currentSlide * slideWidth;
    return isRTL ? offset : -offset;
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto mt-4 overflow-x-auto px-2 sm:px-4 scrollbar-hide">
      <div className="flex min-w-[600px] sm:min-w-0 overflow-x-auto scrollbar-hide">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(${getTransform()}px)`,
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {homeData.players.map((player) => (
            <div 
              key={player.id} 
              className={`relative w-[140px] sm:w-[220px] md:w-[320px] h-[220px] sm:h-[320px] md:h-[480px] rounded-lg overflow-hidden group cursor-pointer flex-shrink-0 ${
                isRTL 
                  ? 'ml-1.5 sm:ml-2.5' 
                  : 'mr-1.5 sm:mr-2.5'
              } shadow-[4px_4px_16px_rgba(0,0,0,0.25)]`}
            >
              <div className="absolute inset-0">
                <LazyImage 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-[14px] sm:text-[20px] md:text-[24px] font-regular text-quinary-tint-800">{player.name}</span>
                </div>
                <span className="text-[10px] sm:text-[14px] md:text-[16px] font-medium text-tertiary">{player.position}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerBoxes;