import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PageNotFound() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  return (
    <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-[1300px] bg-quinary-tint-900 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 sm:p-8 md:p-12">
        <div className="text-center">
          {/* 404 Text */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[80px] sm:text-[100px] md:text-[120px] lg:text-[180px] font-bold text-primary leading-none"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 sm:mt-4"
          >
            <h2 className={`text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-secondary mb-2 sm:mb-4 text-center`}>
              {t('errorPageNotFound')}
            </h2>
            <p className={`text-[16px] sm:text-[18px] md:text-[20px] text-secondary-tint-500 mb-6 sm:mb-8 text-center`}>
              {t('errorPageDescription')}
            </p>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary text-quinary-tint-800 text-[16px] sm:text-[18px] md:text-[20px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('errorBackToHome')}
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 sm:mt-12 flex justify-center gap-3 sm:gap-4"
          >
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full"></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-secondary rounded-full"></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-tertiary rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}