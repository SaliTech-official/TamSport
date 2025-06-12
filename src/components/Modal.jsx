import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

export default function Modal({ isOpen, onClose, data }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { title, content, onlyAcceptable } = data || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(16px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-[1300px] bg-white rounded-lg p-6 mt-8 h-fit"
          >
            {/* Header */}
            <div className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'} justify-between items-center mb-6`}>
              <h2 className={`text-[36px] font-semibold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={`w-9 h-9 flex items-center justify-center text-secondary hover:opacity-80 transition-opacity ${isRTL ? 'ml-0' : 'ml-auto'}`}
              >
                <IoClose size={36} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-secondary mb-6" />

            {/* Content */}
            <p className={`text-[24px] font-normal text-secondary mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {content}
            </p>

            {/* Buttons */}
            <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-4`}>
              {!onlyAcceptable && (
                <button
                  onClick={onClose}
                  className="px-[30px] py-[10px] text-primary text-[16px] font-semibold rounded-[5px] border-[3px] border-primary hover:opacity-90 transition-opacity"
                >
                  {t('modalReject')}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-[30px] py-[10px] bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-[5px] hover:opacity-90 transition-opacity"
              >
                {t('modalAccept')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}