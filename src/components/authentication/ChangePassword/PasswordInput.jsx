import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../common/ErrorMessage';

const PasswordInput = ({
  label,
  value,
  onChange,
  error,
  isRTL,
  showPassword = false,
  onTogglePassword,
  className = ''
}) => {
  const { t } = useTranslation(['validation']);

  return (
    <div className={`w-full ${className}`}>
      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t(label, { ns: 'validation' })}
      </label>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        className={`w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 ${
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-quinary-tint-600 focus:border-primary'
        } outline-none transition-colors duration-300`}
      />
      { error && (  
        <div className="rounded-md mt-4 gap-1 flex items-center justify-center">
          <p className="text-red-600 text-sm ml-2">{t(error, { ns: 'validation' })} </p>
        </div>
      )}
    </div>
  );
};

export default PasswordInput; 