import React, { useState, useEffect } from 'react';

const PlayerBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handlePrevSlide = () => {
      setCurrentSlide(prev => Math.max(0, prev - 1));
    };

    const handleNextSlide = () => {
      setCurrentSlide(prev => Math.min(6, prev + 1));
    };

    document.addEventListener('prevSlide', handlePrevSlide);
    document.addEventListener('nextSlide', handleNextSlide);

    return () => {
      document.removeEventListener('prevSlide', handlePrevSlide);
      document.removeEventListener('nextSlide', handleNextSlide);
    };
  }, []);

  return (
    <div className="w-full max-w-[1300px] mx-auto mt-4 overflow-x-auto px-2 sm:px-4 scrollbar-hide">
      <div className="flex min-w-[600px] sm:min-w-0 overflow-x-auto scrollbar-hide">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 220}px)` }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
            <div 
              key={index} 
              className="relative w-[140px] sm:w-[220px] md:w-[320px] h-[220px] sm:h-[320px] md:h-[480px] rounded-lg overflow-hidden group cursor-pointer flex-shrink-0 mr-3 sm:mr-5 shadow-[4px_4px_16px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0">
                <img 
                  src="/images/banners/PlayersPicture.png" 
                  alt="Player Image" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-[14px] sm:text-[20px] md:text-[24px] font-regular text-quinary-tint-800">Javad</span>
                  <span className="text-[20px] sm:text-[32px] md:text-[40px] font-bold text-quinary-tint-800">Satari</span>
                </div>
                <span className="text-[10px] sm:text-[14px] md:text-[16px] font-medium text-tertiary">Forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerBoxes; 