import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthHttp from '../../hooks/useAuthHttp.jsx';
import { handleBackendErrors } from '../../utils/validators.js';
import { successNotif, errorNotif } from '../../utils/customNotifs.jsx';
import { validatePassword, validateConfirmPassword, validateRequirePasswords } from '../../utils/validators.js';
import { loadNamespaces } from '../../i18n.js';
import PasswordInput from './ChangePassword/PasswordInput';

const ChangePassword = ({ onSuccess }) => {
  const { t, i18n } = useTranslation(['blog', 'validation']);
  const isRTL = i18n.language === 'fa';

  // Load admin validation translations
  useEffect(() => {
    loadNamespaces('validation');
  }, []);

  // Password change state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Setup auth HTTP handler for password change
  const {
    sendRequest: changePassword,
    isLoading: isChangingPassword,
  } = useAuthHttp('http://localhost:8000/api/auth/change_password/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handlePasswordValidation = () => {
    const errors = {};
    const { currentPassword, newPassword, confirmPassword } = passwordFormData;
    
    // Check for empty fields
    if (validateRequirePasswords(currentPassword, newPassword, confirmPassword)) {
      if (!currentPassword) {
        errors.currentPassword = 'profilePasswordRequired';
      }
      if (!newPassword) {
        errors.newPassword = 'profilePasswordRequired';
      }
      if (!confirmPassword) {
        errors.confirmPassword = 'profilePasswordRequired';
      }
      return errors;
    }
    
    // Check password format
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors[0]) {
      errors.newPassword = passwordErrors[0];
    } else if (passwordErrors[1]) {
      errors.newPassword = passwordErrors[1];
    }
    
    // Check password confirmation
    if (validateConfirmPassword(newPassword, confirmPassword)) {
      errors.confirmPassword = 'passwordsDoNotMatch';
    }
    
    return errors;
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setPasswordErrors({});
    
    // Client-side validation
    const validationErrors = handlePasswordValidation();
    
    // If there are client-side validation errors, display them and stop
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    
    try {
      // Send request to API
      const response = await changePassword({
        old_password: passwordFormData.currentPassword,
        password: passwordFormData.newPassword,
        password2: passwordFormData.confirmPassword
      });
      
      // Check if there is an error
      if (response.isError) {
        // Process backend errors
        const { isError, errorContent } = handleBackendErrors(response, passwordFormData);
        
        if (isError) {
          setPasswordErrors(errorContent);
          
          // Show the general error as a notification if it exists
          if (errorContent.general) {
            errorNotif(errorContent.general);
          }
          return;
        }
      }
      
      // Success case
      successNotif(t('profilePasswordChangeSuccess', { ns: 'validation' }));
      
      // Reset form
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      errorNotif(t('profilePasswordChangeError', { ns: 'validation' }));
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear the specific error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
      <PasswordInput
        label="profileCurrentPassword"
        value={passwordFormData.currentPassword}
        onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
        error={passwordErrors.currentPassword}
        isRTL={isRTL}
        showPassword={showPasswords.currentPassword}
        onTogglePassword={() => togglePasswordVisibility('currentPassword')}
      />

      <PasswordInput
        label="profileNewPassword"
        value={passwordFormData.newPassword}
        onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
        error={passwordErrors.newPassword}
        isRTL={isRTL}
        showPassword={showPasswords.newPassword}
        onTogglePassword={() => togglePasswordVisibility('newPassword')}
      />

      <PasswordInput
        label="profileConfirmNewPassword"
        value={passwordFormData.confirmPassword}
        onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
        error={passwordErrors.confirmPassword}
        isRTL={isRTL}
        showPassword={showPasswords.confirmPassword}
        onTogglePassword={() => togglePasswordVisibility('confirmPassword')}
      />
      
      {/* General errors */}
      {passwordErrors.general && (
        <div className="text-red-500 p-3 bg-red-100 rounded">
          {passwordErrors.general}
        </div>
      )}
      
      <div className={`flex ${isRTL ? 'space-x-reverse' : 'space-x-3'} justify-end`}>
        <button 
          type="submit"
          disabled={isChangingPassword}
          className={`px-6 py-2 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 ${
            isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isChangingPassword ? t('loading', { ns: 'blog' }) : t('profileChangePassword', { ns: 'validation' })}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword; 