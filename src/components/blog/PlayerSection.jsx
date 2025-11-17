import React from 'react';
import PlayerBoxes from './PlayerBoxes';
import { useTranslation } from 'react-i18next';
import { useHome } from '../../context/HomeContext.jsx';

const PlayerSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { homeData } = useHome();

  return (
    <>
      <div className="w-full max-w-[1300px] mx-auto mt-8 flex flex-row justify-between items-center px-2 sm:px-4 relative">
        <div className="flex-1"></div>
        <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold text-secondary absolute left-1/2 transform -translate-x-1/2">{t('player')}</h2>
        {
          homeData.players.length > 5 ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => document.dispatchEvent(new CustomEvent('prevSlide'))}
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
              onClick={() => document.dispatchEvent(new CustomEvent('nextSlide'))}
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
           </div>
          ) : <span className='mb-[6rem]'></span>
        }
      </div>
      <PlayerBoxes />
    </>
  );
};

export default PlayerSection; 