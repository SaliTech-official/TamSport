import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { canManageRoles, canEditUser, getUserRole, ROLES } from '../utils/roles';

// Icons
const Icons = {
  Back: ({ isRTL }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  XMark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

const UserForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    is_author: false,
    is_superuser: false,
    is_seller: false,
    phone_number: '',
    first_name: '',
    last_name: '',
    is_active: true,
    last_login: '',
    created_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isEditMode = !!userId;
  const canEditRoles = canManageRoles(user);
  const currentUserRole = getUserRole(user);
  const targetUserRole = getUserRole(formData);

  useEffect(() => {
    if (!user || (getUserRole(user) !== ROLES.SUPER_ADMIN && 
                  getUserRole(user) !== ROLES.ADMIN && 
                  getUserRole(user) !== ROLES.AUTHOR && 
                  getUserRole(user) !== ROLES.SELLER)) {
      navigate('/');
      return;
    }

    if (isEditMode) {
      // Find user data for editing
      const userToEdit = fakeUsers.find(u => u.id === userId);
      if (userToEdit) {
        setFormData({
          is_author: userToEdit.is_author || false,
          is_superuser: userToEdit.is_superuser || false,
          is_seller: userToEdit.is_seller || false,
          phone_number: userToEdit.phone || '',
          first_name: userToEdit.first_name || '',
          last_name: userToEdit.last_name || '',
          is_active: userToEdit.is_active !== false,
          last_login: userToEdit.last_login || '',
          created_date: userToEdit.created_date || ''
        });
      }
    } else {
      // Set default values for new user
      setFormData({
        is_author: false,
        is_superuser: false,
        is_seller: false,
        phone_number: '',
        first_name: '',
        last_name: '',
        is_active: true,
        last_login: '',
        created_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [userId, user, navigate, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = t('adminRequiredField');
    } else if (!/^09\d{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = t('adminInvalidPhoneNumber');
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = t('adminRequiredField');
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = t('adminRequiredField');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call
      // const response = await fetch('/api/users', {
      //   method: isEditMode ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: t('adminUserSavedError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!user || (getUserRole(user) !== ROLES.SUPER_ADMIN && 
                getUserRole(user) !== ROLES.ADMIN && 
                getUserRole(user) !== ROLES.AUTHOR && 
                getUserRole(user) !== ROLES.SELLER)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="p-2 text-secondary hover:text-primary transition-colors duration-300"
              >
                <Icons.Back isRTL={isRTL} />
              </button>
              <div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">
                  {isEditMode ? t('adminEditUser') : t('adminAddNewUser')}
                </h1>
                <p className="text-[16px] sm:text-[18px] text-secondary">
                  {t('adminUserForm')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Changeable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('adminPhoneNumber')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Phone className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.phone_number ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('adminFirstName')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.first_name ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder={t('adminFirstName')}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('adminLastName')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.last_name ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder={t('adminLastName')}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Boolean Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Role Display */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('adminRole')}</span>
                <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                  targetUserRole === ROLES.SUPER_ADMIN ? 'bg-red-100 text-red-800' :
                  targetUserRole === ROLES.ADMIN ? 'bg-blue-100 text-blue-800' :
                  targetUserRole === ROLES.AUTHOR ? 'bg-green-100 text-green-800' :
                  targetUserRole === ROLES.SELLER ? 'bg-yellow-100 text-yellow-800' :
                  targetUserRole === ROLES.USER ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {targetUserRole === ROLES.SUPER_ADMIN ? t('roleSuperAdmin') :
                   targetUserRole === ROLES.ADMIN ? t('roleAdmin') :
                   targetUserRole === ROLES.AUTHOR ? t('roleAuthor') :
                   targetUserRole === ROLES.SELLER ? t('roleSeller') :
                   targetUserRole === ROLES.USER ? t('roleUser') :
                   t('roleUser')}
                </span>
              </div>

              {/* Is Author */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('adminIsAuthor')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_author}
                    onChange={(e) => handleInputChange('is_author', e.target.checked)}
                    disabled={!canEditRoles}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300 ${!canEditRoles ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                </label>
              </div>

              {/* Is Superuser */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('adminIsSuperuser')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_superuser}
                    onChange={(e) => handleInputChange('is_superuser', e.target.checked)}
                    disabled={!canEditRoles || currentUserRole !== ROLES.SUPER_ADMIN}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300 ${(!canEditRoles || currentUserRole !== ROLES.SUPER_ADMIN) ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                </label>
              </div>

              {/* Is Seller */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('adminIsSeller')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_seller}
                    onChange={(e) => handleInputChange('is_seller', e.target.checked)}
                    disabled={!canEditRoles}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300 ${!canEditRoles ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                </label>
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">{t('adminIsActive')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    disabled={!canEditRoles}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300 ${!canEditRoles ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                </label>
              </div>
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Last Login */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('adminLastLogin')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Calendar className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.last_login || 'Never'}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('adminCreatedDate')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Calendar className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.created_date || new Date().toLocaleDateString()}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-4 bg-quaternary/10 border border-quaternary rounded-lg">
                <Icons.XMark className="text-quaternary mr-2" />
                <span className="text-quaternary">{errors.submit}</span>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center p-4 bg-primary/10 border border-primary rounded-lg">
                <Icons.Check className="text-primary mr-2" />
                <span className="text-primary">{t('adminUserSavedSuccess')}</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  t('adminSaveUser')
                )}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
              >
                {t('adminCancel')}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 