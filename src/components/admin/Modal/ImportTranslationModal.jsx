import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleFormIcons } from '../../../data/Icons';

const ImportTranslationModal = ({ isOpen, onClose, onImport }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleImport = () => {
    onImport(htmlContent);
    setHtmlContent('');
    onClose();
  };

  const handleClose = () => {
    setHtmlContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="p-6 border-b border-quinary-tint-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">وارد کردن محتوای ترجمه شده</h2>
              <button
                onClick={handleClose}
                className="text-secondary hover:text-primary transition-colors duration-300"
              >
                <ArticleFormIcons.Close className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-secondary mb-4 text-right">
                محتوای HTML ترجمه شده توسط هوش مصنوعی را در قسمت زیر وارد کنید. تمام قالب‌بندی حفظ خواهد شد.
              </p>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full h-64 p-4 bg-quinary-tint-600 text-primary rounded-lg border-2 transition-colors duration-300 resize-none ${
                  isFocused 
                    ? 'border-quaternary shadow-[0_0_0_1px_rgba(221,44,44,0.3)]' 
                    : 'border-quinary-tint-500 focus:border-primary'
                } outline-none`}
                placeholder="<p>کد HTML ترجمه شده را اینجا وارد کنید...</p>"
                dir="ltr"
              />
            </div>
            <div className="p-6 bg-quinary-tint-900/50 flex justify-end items-center gap-4">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-quinary-tint-700 text-secondary hover:bg-quinary-tint-600 font-semibold transition-all duration-300"
              >
                انصراف
              </button>
              <button
                onClick={handleImport}
                disabled={!htmlContent}
                className="px-8 py-2.5 rounded-lg bg-quaternary text-quinary-tint-800 hover:bg-quaternary-tint-100 disabled:bg-quinary-tint-600 disabled:text-secondary disabled:cursor-not-allowed font-semibold transition-all duration-300 shadow-sm"
              >
                وارد کردن متن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportTranslationModal; 