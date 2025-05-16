import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import NewsFilter from '../components/NewsFilter'
import NewsBox from '../components/NewsBox'
import { newsData } from '../data/newsData'

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(6);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Get filter from URL parameter
    const filterFromUrl = searchParams.get('type');
    if (filterFromUrl && ['all', 'basic', 'video', 'slideshow'].includes(filterFromUrl)) {
      setActiveFilter(filterFromUrl);
      // Scroll to top when filter changes from URL
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [searchParams]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'basic', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'slideshow', label: 'Slideshows' }
  ];

  const filteredNews = activeFilter === 'all' 
    ? newsData 
    : newsData.filter(news => news.type === activeFilter);

  const displayedNews = filteredNews.slice(0, displayCount);
  const hasMoreNews = displayCount < filteredNews.length;

  const handleLearnMore = () => {
    setDisplayCount(prev => prev + (windowWidth < 640 ? 4 : windowWidth < 1024 ? 6 : 9));
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setSearchParams({ type: filterId });
    setDisplayCount(windowWidth < 640 ? 4 : windowWidth < 1024 ? 6 : 9);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayedNews.map((news) => (
            <NewsBox key={news.id} news={news} />
          ))}
        </div>
        {hasMoreNews && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleLearnMore}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300"
            >
              <span className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">Load More</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
