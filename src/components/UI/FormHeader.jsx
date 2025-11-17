import React from 'react';
import { ArticleFormIcons } from '../../data/Icons';

const Icons = ArticleFormIcons;

const FormHeader = ({ title, subtitle, onBack, isRTL = true }) => {
  return (
    <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`p-2 bg-quinary-tint-600 rounded-lg hover:bg-quinary-tint-500 transition-colors duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
          >
            <Icons.ArrowLeft isRTL={isRTL} />
          </button>
          <div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
            <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">
              {title}
            </h1>
            <p className="text-[16px] text-secondary">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader; 