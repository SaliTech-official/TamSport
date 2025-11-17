import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 bottom-[-2rem]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-quinary-tint-700 rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="bg-quinary-tint-600 px-6 py-3 border-b border-quinary-tint-500">
                  <h3 className="text-xl font-bold text-primary">{title}</h3>
                </div>
              )}
              
              {/* Body */}
              <div className="px-6 py-4">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="px-6 py-3 bg-quinary-tint-600 border-t border-quinary-tint-500 flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
