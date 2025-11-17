import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import FormHeader from '../../../components/UI/FormHeader';
import FormActions from '../../../components/UI/FormActions';
import { validateUserForm, validateStrongPassword } from '../../../validators/UserValidators';
import { authIcons } from '../../../data/Icons';

const UserForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
    first_name: '',
    last_name: '',
    is_superuser: false,
    is_author: false,
    is_seller: false,
    is_active: true,
  });
  
  const { sendRequest, isLoading: submitLoading } = useAdminHttp();

  const handleInputChange = (field, value) => {
    // Special handling for password field for live validation
    if (field === 'password') {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (value.trim() === '') {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: ['گذرواژه الزامی است.'],
        }));
      } else {
        const strongPasswordErrors = validateStrongPassword(value);
        if (strongPasswordErrors.length > 0) {
          setErrors(prevErrors => ({
            ...prevErrors,
            password: strongPasswordErrors,
          }));
        } else {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.password;
            return newErrors;
          });
        }
      }
    } else {
      // General handling for other fields
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      setFormData(prev => ({
        ...prev,
        [field]: (typeof value === 'boolean' ? value : value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log('yes');
    
    e.preventDefault();
    setIsLoading(true);

    const generalErrors = validateUserForm(formData);
    let passwordStrengthErrors = [];
    if (formData.password) {
        passwordStrengthErrors = validateStrongPassword(formData.password);
    } else {
        passwordStrengthErrors.push('گذرواژه الزامی است.');
    }

    const combinedErrors = { ...generalErrors };
    if (passwordStrengthErrors.length > 0) {
        combinedErrors.password = passwordStrengthErrors;
    } else if (combinedErrors.password) { // Clear password error if it was set by generalErrors but now resolved
        delete combinedErrors.password;
    }

    setErrors(combinedErrors); // Always set combinedErrors after full validation

    if (Object.keys(combinedErrors).length > 0) {
      setIsLoading(false);
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    const dataToSend = {
      phone_number: formData.phone_number,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      is_superuser: formData.is_superuser,
      is_author: formData.is_author,
      is_seller: formData.is_seller,
      is_active: formData.is_active,
    };
    
    console.log(dataToSend);
    try {
      const response = await sendRequest('/api/admin/user-create/', 'POST', dataToSend);
      console.log(response);
      
      if (response?.isError) {
        // setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد کاربر');
      } else {
        successNotif('کاربر با موفقیت ایجاد شد');
        setTimeout(() => {
          navigate(`/admin/users/edit/${response.id}`);
        }, 1500);
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/users");
  };


  // Check if all required fields are filled and no validation errors
  const isFormComplete = 
    formData.phone_number.trim() !== '' &&
    formData.password.trim() !== '' &&
    !errors.phone_number && // Ensure phone_number has no errors
    !(errors.password && errors.password.length > 0); // Ensure password has no strong password errors

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ایجاد کاربر جدید"
          subtitle="در این صفحه می توانید کاربر جدیدی ایجاد کنید"
          onBack={handleBack}
        />

        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">شماره موبایل *</label>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.phone_number ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="شماره موبایل"
                    dir="ltr"
                  />
                  {errors.phone_number && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.phone_number}</p>}
                </div>
                
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">گذرواژه جدید *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.password ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300 pr-10`}
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
                  {errors.password && Array.isArray(errors.password) && (
                    <ul className="text-quaternary text-[14px] mt-1 text-right list-disc pr-5">
                      {errors.password.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                  {errors.password && !Array.isArray(errors.password) && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.password}</p>}
                </div>
                
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">نام</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.first_name ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام کاربر"
                    dir="rtl"
                  />
                  {errors.first_name && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.last_name ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام خانوادگی کاربر"
                    dir="rtl"
                  />
                  {errors.last_name && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.last_name}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">سطوح دسترسی و وضعیت</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="checkbox"
                    id="is_superuser"
                    checked={formData.is_superuser}
                    onChange={(e) => handleInputChange('is_superuser', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary-tint-100 border-quinary-tint-500 bg-quinary-tint-600"
                  />
                  <label htmlFor="is_superuser" className="text-[16px] text-secondary">ادمین</label>
                </div>
                
                <div>
                  <input
                    type="checkbox"
                    id="is_author"
                    checked={formData.is_author}
                    onChange={(e) => handleInputChange('is_author', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary-tint-100 border-quinary-tint-500 bg-quinary-tint-600"
                  />
                  <label htmlFor="is_author" className="text-[16px] text-secondary">نویسنده</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    id="is_seller"
                    checked={formData.is_seller}
                    onChange={(e) => handleInputChange('is_seller', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary-tint-100 border-quinary-tint-500 bg-quinary-tint-600"
                  />
                  <label htmlFor="is_seller" className="text-[16px] text-secondary">فروشنده</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary-tint-100 border-quinary-tint-500 bg-quinary-tint-600"
                  />
                  <label htmlFor="is_active" className="text-[16px] text-secondary">فعال</label>
                </div>
              </div>
            </div>

            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading || isLoading}
              isSubmitDisabled={Object.keys(errors).length > 0 || submitLoading || isLoading}
              submitText="ایجاد کاربر"
            />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 