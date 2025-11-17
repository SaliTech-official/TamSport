import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadNamespaces } from '../../i18n';
import { scrollToSection, navigateToNewsWithFilter, scrollToAboutSection } from '../../utils/navigation';

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['blog']);
  const isRTL = i18n.language === 'fa';
  
  // Ensure the blog namespace is loaded
  useEffect(() => {
    loadNamespaces('blog');
  }, []);
  
  const footerColumns = [
    {
      title: t('footerHome', { ns: 'blog' }),
      items: [
        { label: t('footerLatestNews', { ns: 'blog' }), sectionId: 'latest-news' },
        { label: t('footerTamsTeam', { ns: 'blog' }), sectionId: 'team-boxes' },
        { label: t('footerTamsShop', { ns: 'blog' }), sectionId: 'shop-section' },
        { label: t('footerPlayers', { ns: 'blog' }), sectionId: 'player-section' }
      ]
    },
    {
      title: t('footerNews', { ns: 'blog' }),
      items: [
        { label: t('footerAllContent', { ns: 'blog' }), filter: "all" },
        { label: t('footerArticleContent', { ns: 'blog' }), filter: "TX" },
        { label: t('footerVideoContent', { ns: 'blog' }), filter: "VD" },
        { label: t('footerSlideshowContent', { ns: 'blog' }), filter: "SS" }
      ]
    },
    {
      title: t('footerShop', { ns: 'blog' }),
      items: [
        { label: t('footerComingSoon', { ns: 'blog' }), path: "/shop" },
        { label: t('footerComingSoon', { ns: 'blog' }), path: "/shop" },
        { label: t('footerComingSoon', { ns: 'blog' }), path: "/shop" },
        { label: t('footerComingSoon', { ns: 'blog' }), path: "/shop" }
      ]
    },
    {
      title: t('footerAbout', { ns: 'blog' }),
      items: [
        { label: t('footerTeamName', { ns: 'blog' }), sectionId: "team-name" },
        { label: t('footerTeamLogo', { ns: 'blog' }), sectionId: "team-descriptions" },
        { label: t('footerTeamDescriptions', { ns: 'blog' }), sectionId: "team-descriptions" },
        { label: t('footerTeamHonors', { ns: 'blog' }), sectionId: "team-honors" }
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
                    if (column.title === t('footerHome', { ns: 'blog' }) && item.sectionId) {
                      scrollToSection(item.sectionId, navigate);
                    } else if (column.title === t('footerNews', { ns: 'blog' }) && item.filter) {
                      navigateToNewsWithFilter(item.filter, navigate);
                    } else if (column.title === t('footerAbout', { ns: 'blog' }) && item.sectionId) {
                      scrollToAboutSection(item.sectionId, navigate);
                    } else if (column.title === t('footerShop', { ns: 'blog' }) && item.path) {
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