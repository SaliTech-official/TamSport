import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NewsFilter = ({ activeFilter, onFilterChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const filters = [
    { id: 'all', label: t('newsAll') },
    { id: 'basic', label: t('newsArticles') },
    { id: 'video', label: t('newsVideos') },
    { id: 'slideshow', label: t('newsSlideshows') }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterClick = (filterId) => {
    onFilterChange(filterId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full relative" ref={menuRef}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sm:hidden w-full flex items-center justify-between px-4 py-2 bg-quinary-tint-800 rounded-lg text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300"
      >
        <span className="text-[16px] font-medium">
          {filters.find(f => f.id === activeFilter)?.label || t('newsAll')}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`sm:hidden absolute top-full left-0 right-0 mt-1 bg-quinary-tint-800 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50 transition-all duration-300 ease-in-out transform origin-top ${
          isMobileMenuOpen 
            ? 'opacity-100 scale-y-100' 
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`w-full px-4 py-2 text-left text-[16px] font-medium transition-colors ${
              activeFilter === filter.id
                ? 'text-quaternary bg-quinary-tint-700'
                : 'text-secondary hover:text-quaternary hover:bg-quinary-tint-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Desktop Menu */}
      <nav className="hidden sm:flex items-center gap-4 md:gap-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`text-[16px] md:text-[18px] lg:text-[20px] font-medium transition-all duration-300 relative group ${
              activeFilter === filter.id ? 'text-quaternary' : 'text-secondary hover:text-quaternary'
            }`}
          >
            {filter.label}
            <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
              activeFilter === filter.id ? 'w-full bg-quaternary' : 'group-hover:w-full bg-quaternary'
            }`}></span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NewsFilter; 