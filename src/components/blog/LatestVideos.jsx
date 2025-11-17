import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHome } from '../../context/HomeContext';
import LazyImage from '../UI/LazyImage';

const LatestVideos = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const currentLang = i18n.language;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { homeData } = useHome();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get the latest 5 videos
  const latestVideos = homeData.videos.slice(0, 5);

  // Split into two groups: first two and last three
  const [firstTwo, lastThree] = [
    latestVideos.slice(0, 2),
    latestVideos.slice(2)
  ];

  const handleTeamClick = (e, teamId) => {
    e.stopPropagation();
    navigate(`/news?team=${teamId}&type=VD`);
  };

  return (
    <>
      <div className="w-full max-w-[1300px] mx-auto mt-8 flex flex-row justify-between items-center px-2 sm:px-4">
        <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-regular text-secondary order-1">{t('latestVideos')}</h2>
        <button 
          onClick={() => navigate('/news?type=VD')}
          className="flex items-center gap-1 text-[16px] sm:text-[20px] md:text-[24px] text-secondary-tint-200 hover:text-secondary-tint-600 transition-colors duration-300 no-underline group order-2"
        >
          {t('viewAll')}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`text-secondary-tint-200 group-hover:text-secondary-tint-600 transition-colors duration-300 ${isRTL ? 'rotate-180' : ''}`}
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-[1300px] mx-auto mt-4 flex flex-col lg:flex-row justify-between gap-4 px-2 sm:px-4">
        {firstTwo.slice(0, windowWidth < 1024 ? 1 : 2).map((video) => (
          <div 
            key={video.id} 
            className="w-full lg:w-1/2 h-[180px] sm:h-[260px] md:h-[380px] rounded-lg overflow-hidden relative group cursor-pointer"
            onClick={() => navigate(`/news/${video.slug}`)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <LazyImage 
                src={video.images[0]} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            {/* Top Line */}
            <div className="absolute top-2 sm:top-6 left-2 sm:left-6">
              <div className="h-[2px] w-[20px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[200px]"></div>
            </div>
            {/* Top Info */}
            <div className="absolute top-[8px] sm:top-[18px] right-2 sm:right-6 flex items-center">
              <span className="text-[10px] sm:text-[14px] font-medium text-quinary-tint-800">
                {video.created_date}
              </span>
              <div className="mx-1 sm:mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span 
                className="cursor-default hover:text-[white] text-[10px] sm:text-[14px] font-medium text-tertiary-tint-200"
                onClick={(e)=>handleTeamClick(e, video.team.id)}
              >
                {video.team.name}
              </span>
            </div>
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="0.5 "
                stroke="currentColor" 
                className="w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[68px] md:h-[68px] text-quinary-tint-800"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" 
                />
              </svg>
            </div>
            {/* Bottom Title */}
            <div className={`absolute bottom-2 sm:bottom-8 ${isRTL ? 'right-2 sm:right-6' : 'left-2 sm:left-6'}`}>
              <h3 className={`text-[16px] sm:text-[24px] md:text-[32px] font-bold text-quinary-tint-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Small Video Boxes */}
      <div className="w-full max-w-[1300px] mx-auto mt-4 flex flex-col sm:flex-row justify-between gap-4 px-2 sm:px-4">
        {lastThree.slice(0, windowWidth < 640 ? 0 : windowWidth < 1024 ? 2 : 3).map((video) => (
          <div 
            key={video.id} 
            className="w-full sm:w-1/2 lg:w-1/3 h-[120px] sm:h-[180px] md:h-[220px] rounded-lg overflow-hidden relative group cursor-pointer"
            onClick={() => navigate(`/news/${video.slug}`)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <LazyImage 
                src={video.images[0]} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            {/* Top Line */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <div className="h-[1px] w-[12px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[100px]"></div>
            </div>
            {/* Top Info */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center">
              <span className="text-[10px] sm:text-[12px] font-regular text-quinary-tint-800">
                {video.created_date}
              </span>
              <div className="mx-1 sm:mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span className="text-[10px] sm:text-[12px] font-regular text-tertiary-tint-200">
                {video.category}
              </span>
            </div>
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="0.5"
                stroke="currentColor" 
                className="w-[24px] h-[24px] sm:w-[36px] sm:h-[36px] md:w-[48px] md:h-[48px] text-quinary-tint-800"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" 
                />
              </svg>
            </div>
            {/* Bottom Title */}
            <div className={`absolute bottom-2 sm:bottom-4 ${isRTL ? 'right-2 sm:right-4' : 'left-2 sm:left-4'}`}>
              <h3 className={`text-[12px] sm:text-[16px] md:text-[20px] font-bold text-quinary-tint-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LatestVideos; 