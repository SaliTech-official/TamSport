import React, { useState } from 'react';
import Modal from '../../UI/Modal';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validateChangePassword } from '../../../validators/UserValidators';
import { authIcons } from '../../../data/Icons';

const ChangePasswordModal = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoading: submitLoading, sendRequest } = useAdminHttp();

  const handlePasswordInputChange = (field, value) => {
    if (field === 'newPassword') {
      setNewPassword(value);
      const validationErrors = validateChangePassword(value, repeatPassword);
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors.new_password;
        delete updatedErrors.repeat_password; // Also clear repeat_password error if new_password changes
        return { ...updatedErrors, ...validationErrors };
      });
    } else if (field === 'repeatPassword') {
      setRepeatPassword(value);
      const validationErrors = validateChangePassword(newPassword, value);
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors.new_password; // Also clear new_password error if repeat_password changes
        delete updatedErrors.repeat_password;
        return { ...updatedErrors, ...validationErrors };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalValidationErrors = validateChangePassword(newPassword, repeatPassword);
    setErrors(finalValidationErrors);

    if (Object.keys(finalValidationErrors).length > 0) {
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    try {
      const response = await sendRequest(`/api/admin/user-change-password/${userId}/`, 'PATCH', {
        new_password: newPassword,
        repeat_password: repeatPassword,
      });

      if (response?.isError) {
        const backendErrors = response?.errorContent || {};
        setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        errorNotif('خطا در تغییر گذرواژه');
      } else {
        successNotif('گذرواژه با موفقیت تغییر کرد.');
        onClose();
        setNewPassword('');
        setRepeatPassword('');
        setErrors({});
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
      if (error && error.response && error.response.data) {
        setErrors(error.response.data);
      } else if (typeof error === 'object' && error !== null) {
        setErrors(error);
      } else {
        setErrors({ general: 'خطایی رخ داد.' });
      }
      console.error('Error submitting password change:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تغییر گذرواژه"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={submitLoading}
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium disabled:opacity-[50%] disabled:cursor-not-allowed"
            disabled={submitLoading || Object.keys(errors).length > 0}
          >
            {submitLoading ? 'در حال تغییر...' : 'تغییر گذرواژه'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[16px] text-secondary mb-2 text-right">گذرواژه جدید *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
              className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.new_password ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300 pr-10`}
              placeholder="گذرواژه جدید"
              dir="ltr"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showPassword ? authIcons.EyeSlash() : authIcons.Eye()}
            </span>
          </div>
          {errors?.new_password && Array.isArray(errors.new_password) && (
            <ul className="text-quaternary text-[14px] mt-1 text-right list-disc pr-5">
              {errors.new_password.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
           {errors?.new_password && !Array.isArray(errors.new_password) && (
            <p className="text-quaternary text-[14px] mt-1 text-right">{errors.new_password}</p>
          )}
        </div>
        <div>
          <label className="block text-[16px] text-secondary mb-2 text-right">تکرار گذرواژه جدید *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={repeatPassword}
              onChange={(e) => handlePasswordInputChange('repeatPassword', e.target.value)}
              className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.repeat_password ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300 pr-10`}
              placeholder="تکرار گذرواژه جدید"
              dir="ltr"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showPassword ? authIcons.EyeSlash() : authIcons.Eye()}
            </span>
          </div>
          {errors?.repeat_password && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.repeat_password}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal; 