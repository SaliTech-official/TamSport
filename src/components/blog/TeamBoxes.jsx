import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHome } from '../../context/HomeContext';
import LazyImage from '../UI/LazyImage';

const TeamBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { homeData } = useHome();
  const totalSlides = Math.ceil(homeData.tam_teams.length / 5);
  const slidesPerView = 5;

  // Reset slide when language changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [i18n.language]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  // Calculate transform for slide
  const getTransform = () => {
    const slideWidth = 220;
    const offset = currentSlide * slideWidth;
    return isRTL ? offset : -offset;
  };

  return (
    <>
      <div className="w-full max-w-[1300px] mx-auto mt-8 flex flex-row justify-between items-center px-2 sm:px-4">
        <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-regular text-secondary order-1">{t('tamsTeam')}</h2>
        { homeData.tam_teams.length > 5 ? (
          <div className="flex items-center gap-2 sm:gap-4 mt-2 lg:mt-0 order-2">
          <button 
            onClick={handlePrevSlide}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={`w-4 h-4 sm:w-6 sm:h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300 ${isRTL ? 'rotate-180' : ''}`}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 19.5L8.25 12l7.5-7.5" 
              />
            </svg>
          </button>
          <button 
            onClick={handleNextSlide}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={`w-4 h-4 sm:w-6 sm:h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300 ${isRTL ? 'rotate-180' : ''}`}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8.25 4.5l7.5 7.5-7.5 7.5" 
              />
            </svg>
          </button>
        </div> ) : <span className='mb-[0.8rem]'></span>
         }
      </div>

      <div className="w-full max-w-[1300px] mx-auto mt-4 overflow-hidden px-2 sm:px-4">
        <div className="relative">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(${getTransform()}px)`,
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {homeData.tam_teams.map((team) => (
              <div 
                key={team.id} 
                className={`relative w-[140px] sm:w-[200px] h-[220px] sm:h-[340px] rounded-[16px] overflow-hidden group cursor-pointer flex-shrink-0 ${
                  isRTL 
                    ? 'ml-1.5 sm:ml-2.5' 
                    : 'mr-1.5 sm:mr-2.5'
                }`}
              >
                <div className="absolute inset-0">
                  <LazyImage 
                    src={team.image} 
                    alt={team.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-1.5 right-1.5 flex items-center justify-center gap-1.5">
                  <span className="text-[14px] sm:text-[24px] font-bold text-quinary-tint-800">{team.name}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className={`w-4 h-4 sm:w-6 sm:h-6 text-quinary-tint-800 ${isRTL ? 'rotate-180' : ''}`}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" 
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamBoxes; 