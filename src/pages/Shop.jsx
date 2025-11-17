import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Shop() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="pt-8 sm:pt-12 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-primary mb-2 sm:mb-3 md:mb-4">
              {t('shopPageComingSoon')}
            </h1>
            <p className="text-[18px] sm:text-[20px] md:text-[24px] text-secondary-tint-500 mb-6 sm:mb-7 md:mb-8">
              {t('shopPagePreparing')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center mb-8 sm:mb-10 md:mb-12"
          >
            <div className="w-[2px] h-24 sm:h-28 md:h-32 bg-quaternary"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-medium text-primary mb-4 sm:mb-5 md:mb-6">
              {t('shopPageTitle')}
            </h2>
            <p className={`text-[16px] sm:text-[18px] md:text-[20px] text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('shopPageDescription')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white text-[16px] sm:text-[18px] font-medium rounded-lg hover:bg-primary-tint-500 transition-colors duration-300"
            >
              {t('shopPageBackToHome')}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
