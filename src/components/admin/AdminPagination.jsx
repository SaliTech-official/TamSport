import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Style for pagination buttons
  const getPaginationButtonStyle = (isActive) => {
    return `px-3 py-1 rounded-md text-sm font-bold transition-colors duration-200 ${
      isActive 
        ? 'bg-primary text-quinary-tint-800 shadow' 
        : 'bg-quinary-tint-800 text-primary hover:bg-primary hover:text-quinary-tint-800'
    }`;
  };

  // Generate pagination buttons array
  const renderPaginationButtons = () => {
    const buttons = [];
    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        className={getPaginationButtonStyle(currentPage === 1)}
        disabled={currentPage === 1}
      >
        1
      </button>
    );
    // Add ellipsis after first page if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-start" className="px-3 py-1">...</span>
      );
    }
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={getPaginationButtonStyle(currentPage === i)}
          >
            {i}
          </button>
        );
      }
    }
    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2 && totalPages > 3) {
      buttons.push(
        <span key="ellipsis-end" className="px-3 py-1">...</span>
      );
    }
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => onPageChange(totalPages)}
          className={getPaginationButtonStyle(currentPage === totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }
    return buttons;
  };

  // Options for items per page
  const options = [5, 8, 10, 25, 50];

  // Convert number to Persian numeral
  const toPersianNumeral = (num) => {
    const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().split('').map(digit => persianNumerals[parseInt(digit)]).join('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2"
    >
      <div className="mb-4 sm:mb-0 flex items-center relative " ref={dropdownRef}>
        <span className="text-sm text-secondary mr-5">نمایش:</span>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center border border-gray-300 bg-quinary-tint-800 text-primary rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[50px]"
          >
            <span>{toPersianNumeral(itemsPerPage)}</span>
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full mb-1 left-0 bg-quinary-tint-800 border border-gray-300 rounded-md shadow-lg overflow-hidden z-10"
                style={{ transformOrigin: "bottom" }}
              >
                <div className="py-1">
                  {options.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        onItemsPerPageChange(option);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-right px-4 py-2 text-sm transition-colors duration-150 ${
                        itemsPerPage === option 
                          ? 'bg-primary text-quinary-tint-800 font-bold' 
                          : 'text-primary hover:bg-primary hover:text-quinary-tint-800'
                      }`}
                    >
                      {toPersianNumeral(option)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mr-2 p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary-tint-100'}`}
          aria-label="صفحه قبل"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex space-x-1">
          {renderPaginationButtons()}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-2 p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary-tint-100'}`}
          aria-label="صفحه بعد"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-sm text-gray-500 mt-4 sm:mt-0">
        صفحه {currentPage} از {totalPages || 1}
      </div>
    </motion.div>
  );
};

export default AdminPagination; 