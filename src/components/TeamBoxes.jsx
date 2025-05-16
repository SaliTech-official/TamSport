import React, { useState } from 'react';

const TeamBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <div className="w-full max-w-[1300px] mx-auto mt-8 flex flex-row justify-between items-center px-2 sm:px-4">
        <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-regular text-secondary order-1">TAM'S TEAM</h2>
        <div className="flex items-center gap-2 sm:gap-4 mt-2 lg:mt-0 order-2">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-4 h-4 sm:w-6 sm:h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 19.5L8.25 12l7.5-7.5" 
              />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(6, prev + 1))}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-4 h-4 sm:w-6 sm:h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8.25 4.5l7.5 7.5-7.5 7.5" 
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1300px] mx-auto mt-4 overflow-x-auto px-2 sm:px-4 scrollbar-hide">
        <div className="flex min-w-[600px] sm:min-w-0 overflow-x-auto scrollbar-hide">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 220}px)` }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
              <div key={index} className="relative w-[140px] sm:w-[200px] h-[220px] sm:h-[340px] rounded-[16px] overflow-hidden group cursor-pointer flex-shrink-0 mr-3 sm:mr-5">
                <div className="absolute inset-0">
                  <img 
                    src="/images/banners/ArticlePicture.png" 
                    alt="Team Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-1.5 right-1.5 flex items-center justify-center gap-1.5">
                  <span className="text-[14px] sm:text-[24px] font-bold text-quinary-tint-800">FOOTBALL</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-4 h-4 sm:w-6 sm:h-6 text-quinary-tint-800"
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