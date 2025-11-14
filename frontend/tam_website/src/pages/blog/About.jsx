import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  return (
    <div className="w-full min-h-screen bg-quinary-tint-600">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="pt-8 sm:pt-12 md:pt-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-11">
            {/* Text Content */}
            <div className="w-full lg:w-auto flex-1">
              <h1 id="team-name" className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-primary mb-4 sm:mb-6">
                {t('aboutTeamName')}
              </h1>
              <div className="w-full lg:w-[790px] mt-4 sm:mt-6">
                <div id="team-descriptions" className={`text-[18px] sm:text-[24px] md:text-[32px] font-normal text-secondary transition-all duration-300 ${
                  isExpanded ? 'h-auto' : 'h-[200px] sm:h-[300px] md:h-[400px]'
                } overflow-hidden relative ${isRTL ? 'text-right' : 'text-left'} text-justify`}>
                  <p className="leading-relaxed text-justify">
                    {t('aboutTeamDescription')}
                  </p>
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-quinary-tint-600 to-transparent"></div>
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 text-primary text-justify hover:text-primary-tint-500 transition-colors duration-300 text-[16px] sm:text-[18px] font-medium"
                >
                  {isExpanded ? t('aboutShowLess') : t('aboutReadMore')}
                </button>
              </div>
            </div>
            
            {/* Image */}
            <div className="w-full lg:w-[450px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
              <img 
                src="/images/logos/AboutLogo.png" 
                alt="About Logo" 
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* <div className="mt-16 sm:mt-20 md:mt-32">
            <h2 id="team-honors" className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-primary">
              {t('aboutImportantHonors')}
            </h2>
            
            <div className="flex mt-4 sm:mt-6">
              <div className="w-[1px] bg-quaternary"></div>
              
              <div className={`${isRTL ? 'mr-4 sm:mr-6' : 'ml-4 sm:ml-6'}`}>
                {[...Array(12)].map((_, index) => (
                  <p key={index} className="text-[16px] sm:text-[20px] md:text-[24px] font-medium text-primary-shade-600 mb-2 sm:mb-3 md:mb-4">
                    {t('aboutPremierLeagueChampionship')}
                  </p>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
