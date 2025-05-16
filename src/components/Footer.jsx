import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection, navigateToNewsWithFilter, scrollToAboutSection } from '../utils/navigation';

const Footer = () => {
  const navigate = useNavigate();
  
  const footerColumns = [
    {
      title: 'Home',
      items: [
        { label: 'Latest News', sectionId: 'latest-news' },
        { label: "Tam's Team", sectionId: 'team-boxes' },
        { label: "Tam's Shop", sectionId: 'shop-section' },
        { label: 'Players', sectionId: 'player-section' }
      ]
    },
    {
      title: "News",
      items: [
        { label: "All Content", filter: "all" },
        { label: "Article Content", filter: "basic" },
        { label: "Video Content", filter: "video" },
        { label: "Slideshow Content", filter: "slideshow" }
      ]
    },
    {
      title: 'Shop',
      items: [
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" }
      ]
    },
    {
      title: "About",
      items: [
        { label: "Team Name", sectionId: "team-name" },
        { label: "Team Logo", sectionId: "team-descriptions" },
        { label: "Team descriptions", sectionId: "team-descriptions" },
        { label: "Team Honors", sectionId: "team-honors" }
      ]
    }
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto mt-8 px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        {footerColumns.map((column, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="text-[18px] sm:text-[20px] md:text-[24px] font-medium text-secondary mb-4 sm:mb-6 md:mb-[30px]">
              {column.title}
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-[16px]">
              {column.items.map((item, itemIndex) => (
                <span 
                  key={itemIndex} 
                  className="text-[14px] sm:text-[15px] md:text-[16px] font-normal text-secondary cursor-pointer hover:opacity-80"
                  onClick={() => {
                    if (column.title === 'Home' && item.sectionId) {
                      scrollToSection(item.sectionId, navigate);
                    } else if (column.title === 'News' && item.filter) {
                      navigateToNewsWithFilter(item.filter, navigate);
                    } else if (column.title === 'About' && item.sectionId) {
                      scrollToAboutSection(item.sectionId, navigate);
                    } else if (column.title === 'Shop' && item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer; 