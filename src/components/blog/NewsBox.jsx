import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LazyImage from '../UI/LazyImage';

const NewsBox = ({ 
  id,
  title,
  body,
  author_name,
  slug,
  view_count,
  time_ago,
  likes,
  images,
  type,
  video_url,
  first_category,
  team,
 }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { isRTL } = i18n.language === 'fa';


  const handleBoxClick = () => {
    navigate(`/news/${slug}`);
  };

  const handleTeamClick = (e) => {
    e.stopPropagation();
    if (team?.id) {
      navigate(`/news?team=${team.id}`);
    }
  };

  // Strip HTML tags for plain text display
  const plainTextBody = body ? String(body).replace(/<[^>]+>/g, '') : '';


  return (
    <div 
      className="w-full h-[280px] sm:h-[300px] md:h-[340px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer"
      onClick={handleBoxClick}
    >
      {/* Top Half - Image Section */}
      <div className="h-1/2 relative overflow-hidden">
        <LazyImage 
          src={images[0]} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {type === 'VD' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-quinary-tint-800`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
          </div>
        )}
        {type === 'slideshow' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-quinary-tint-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
        </div>
      </div>
      
      {/* Bottom Half - Content Section */}
      <div className="h-1/2 p-2 sm:p-3 md:p-4 flex flex-col">
        <div className={`flex items-start ${!isRTL ? 'gap-[0.3rem]' : ''}`}>
          {type === 'SS' && (
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5}
              stroke="currentColor" 
              className="text-secondary mr-2 w-[6.5%] h-max mt-[0.1rem]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
          )}
          {type === 'VD' && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  className="text-secondary mr-2 w-[7%] h-max mt-[0.1rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
          )}
          <h3 
            className="w-[90%] text-[16px] sm:text-[18px] md:text-[20px] font-bold text-secondary line-clamp-2 transition-colors duration-200"
          >
            {title}
          </h3>
        </div>
        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-secondary-tint-100 mt-2 line-clamp-2">
          {plainTextBody}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-[10px] sm:text-[11px] md:text-[12px] font-regular text-secondary-tint-200">{time_ago}</span>
            <div className="h-3 w-[1px] bg-secondary mx-2"></div>
            {team?.id ? (
              <button
                onClick={(e) => {handleTeamClick(e)}}
                className="text-[10px] sm:text-[11px] md:text-[12px] font-regular text-quaternary hover:text-secondary transition-colors duration-200"
              >
                {team.name || ''}
              </button>
            ) : (
              <span className="text-[10px] sm:text-[11px] md:text-[12px] font-regular text-quaternary">{team?.name || ''}</span>
            )}
          </div>
          <div>
            <svg 
              className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsBox; 