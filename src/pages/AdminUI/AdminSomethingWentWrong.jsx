import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

const AdminSomethingWentWrong = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleGoToDashboard = () => {
    navigate('/admin');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-quinary-tint-800 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-primary p-4 sm:p-6 md:p-8 text-center">
            <motion.div
              variants={iconVariants}
              className="mb-4 sm:mb-6 md:mb-8"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-3 sm:border-4 border-quinary-tint-800 rounded-full opacity-20"
                />
                <div className="absolute inset-1 sm:inset-2 bg-quinary-tint-800 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-2xl sm:text-2xl md:text-3xl text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-quinary-tint-800 mb-2 sm:mb-3 md:mb-4"
            >
              خطایی رخ داده است
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-quinary-tint-700 max-w-xs sm:max-w-sm md:max-w-xl mx-auto leading-relaxed"
            >
              متأسفانه مشکلی در سیستم رخ داده است. لطفاً دوباره تلاش کنید
            </motion.p>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-8">
            <motion.div
              variants={itemVariants}
              className="mb-4 sm:mb-6 md:mb-8"
            >
              <div className="bg-quaternary-tint-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-quaternary-tint-200">
                <h2 className="text-lg sm:text-xl font-bold text-quaternary mb-3 sm:mb-4 text-center">
                  چه کاری می‌توانید انجام دهید؟
                </h2>
                <div className="space-y-2 sm:space-y-3 text-right">
                  <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-quaternary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <p className="text-xs sm:text-sm text-secondary-tint-300 leading-relaxed">
                      صفحه را دوباره بارگذاری کنید تا مشکل برطرف شود
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-quaternary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <p className="text-xs sm:text-sm text-secondary-tint-300 leading-relaxed">
                      به داشبورد بازگردید و دوباره تلاش کنید
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-quaternary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <p className="text-xs sm:text-sm text-secondary-tint-300 leading-relaxed">
                      اگر مشکل ادامه داشت، با تیم پشتیبانی تماس بگیرید
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {/* Dashboard Button */}
              <button
                onClick={handleGoToDashboard}
                className="group bg-primary text-white rounded-lg sm:rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 space-x-reverse mb-2 sm:mb-3">
                  <FaHome className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm sm:text-base font-semibold">داشبورد</span>
                </div>
                <p className="text-xs text-quinary-tint-200 leading-relaxed">
                  بازگشت به صفحه اصلی پنل مدیریت
                </p>
              </button>

              {/* Retry Button */}
              <button
                onClick={handleRetry}
                className="group bg-secondary text-white rounded-lg sm:rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 space-x-reverse mb-2 sm:mb-3">
                  <FaRedo className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm sm:text-base font-semibold">تلاش مجدد</span>
                </div>
                <p className="text-xs text-quinary-tint-200 leading-relaxed">
                  بارگذاری مجدد صفحه و تلاش دوباره
                </p>
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              variants={itemVariants}
              className="mt-4 sm:mt-6 md:mt-8 text-center"
            >
              <div className="bg-quinary-tint-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-quinary-tint-200">
                <p className="text-xs sm:text-sm text-secondary-tint-300 leading-relaxed">
                  اگر مشکل ادامه داشت، لطفاً با تیم پشتیبانی فنی تماس بگیرید
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSomethingWentWrong;
