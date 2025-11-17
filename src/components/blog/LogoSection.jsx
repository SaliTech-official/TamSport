import React from 'react';

const LogoSection = () => {
  return (
    <div className="w-full max-w-[1300px] mx-auto mt-4 px-4 sm:px-6 md:px-8">
      <div className="relative flex items-center justify-center">
        <div className="hidden sm:block w-[200px] md:w-[400px] lg:w-[550px] h-[2px] bg-quaternary absolute left-0 top-[68px] sm:top-[102px] md:top-[136px]"></div>
        <div className="hidden sm:block w-[200px] md:w-[400px] lg:w-[550px] h-[2px] bg-quaternary absolute right-0 top-[68px] sm:top-[102px] md:top-[136px]"></div>
        <img 
          src="/images/logos/FooterLogo.png" 
          alt="FC TAM Logo" 
          className="w-[62px] h-[121px] sm:w-[93px] sm:h-[182px] md:w-[124px] md:h-[243px] object-contain"
        />
      </div>
    </div>
  );
};

export default LogoSection; 