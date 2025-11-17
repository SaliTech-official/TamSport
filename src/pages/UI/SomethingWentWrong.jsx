import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SomethingWentWrong = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[1300px] rounded-2xl px-6 sm:px-8 md:px-12"
      >
        <div className="text-center">
          {/* Error Icon */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 border-4 border-primary rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-4 border-4 border-secondary rounded-full"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-8 border-4 border-primary rounded-full"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold text-primary mb-4"
          >
            {t('somethingWentWrong')}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className={`text-[16px] sm:text-[18px] md:text-[20px] text-secondary-tint-200 mb-8 text-center`}
          >
            {t('somethingWentWrongDescription')}
          </motion.p>

          {/* Error Code */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <span className="text-[14px] sm:text-[16px] text-secondary-tint-200">
              {t('somethingWentWrongErrorCode')}:{' '}
            </span>
            <span className="font-mono text-[14px] sm:text-[16px] text-quaternary">
              {Math.random().toString(36).substring(2, 8).toUpperCase()}
            </span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-quinary-tint-800 text-[16px] sm:text-[18px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('somethingWentWrongTryAgain')}
            </Link>
            <a
              href="mailto:support@tamsport.com"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-quinary-tint-800 text-[16px] sm:text-[18px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('somethingWentWrongContactSupport')}
            </a>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-12 flex justify-center gap-3 sm:gap-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="w-2 sm:w-3 h-2 sm:h-3 bg-secondary rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="w-2 sm:w-3 h-2 sm:h-3 bg-tertiary-200 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SomethingWentWrong;