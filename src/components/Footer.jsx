import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToSection, navigateToNewsWithFilter, scrollToAboutSection } from '../utils/navigation';

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  
  const footerColumns = [
    {
      title: t('footerHome'),
      items: [
        { label: t('footerLatestNews'), sectionId: 'latest-news' },
        { label: t('footerTamsTeam'), sectionId: 'team-boxes' },
        { label: t('footerTamsShop'), sectionId: 'shop-section' },
        { label: t('footerPlayers'), sectionId: 'player-section' }
      ]
    },
    {
      title: t('footerNews'),
      items: [
        { label: t('footerAllContent'), filter: "all" },
        { label: t('footerArticleContent'), filter: "basic" },
        { label: t('footerVideoContent'), filter: "video" },
        { label: t('footerSlideshowContent'), filter: "slideshow" }
      ]
    },
    {
      title: t('footerShop'),
      items: [
        { label: t('footerComingSoon'), path: "/shop" },
        { label: t('footerComingSoon'), path: "/shop" },
        { label: t('footerComingSoon'), path: "/shop" },
        { label: t('footerComingSoon'), path: "/shop" }
      ]
    },
    {
      title: t('footerAbout'),
      items: [
        { label: t('footerTeamName'), sectionId: "team-name" },
        { label: t('footerTeamLogo'), sectionId: "team-descriptions" },
        { label: t('footerTeamDescriptions'), sectionId: "team-descriptions" },
        { label: t('footerTeamHonors'), sectionId: "team-honors" }
      ]
    }
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto mt-8 px-4 sm:px-6 md:px-8">
      <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
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
                    if (column.title === t('footerHome') && item.sectionId) {
                      scrollToSection(item.sectionId, navigate);
                    } else if (column.title === t('footerNews') && item.filter) {
                      navigateToNewsWithFilter(item.filter, navigate);
                    } else if (column.title === t('footerAbout') && item.sectionId) {
                      scrollToAboutSection(item.sectionId, navigate);
                    } else if (column.title === t('footerShop') && item.path) {
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