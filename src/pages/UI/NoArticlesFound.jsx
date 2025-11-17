import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NoArticlesFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col items-center justify-center px-4 py-6 md:py-8 lg:py-10 box-border"
      style={{ minHeight: '60vh' }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120, delay: 0.15 }}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-4 text-quaternary flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3/4 h-3/4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-quaternary mb-2 text-center break-words max-w-full"
      >
        {t('noArticlesFound')}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
        className="text-secondary text-center max-w-md md:max-w-xl lg:max-w-2xl mb-6 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed break-words"
      >
        {t('noArticlesFoundDescription')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl justify-center"
      >
        <button
          className="px-4 py-2 md:px-6 md:py-3 bg-quaternary text-quinary-tint-800 rounded-lg text-sm md:text-base lg:text-lg hover:bg-quaternary-100 transition-colors duration-200 w-full sm:w-auto shadow"
        >
          {t('tryDifferentFilter')}
        </button>
        <button
          className="px-4 py-2 md:px-6 md:py-3 bg-secondary text-quinary-tint-800 border border-secondary rounded-lg text-sm md:text-base lg:text-lg hover:bg-secondary-tint-100 transition-colors duration-200 w-full sm:w-auto shadow"
          onClick={() => { navigate("/") }}
        >
          {t('refreshPage')}
        </button>
      </motion.div>
    </motion.div>
  );
} 