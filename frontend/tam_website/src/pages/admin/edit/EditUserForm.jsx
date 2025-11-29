import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import AdminSomethingWentWrong from '../../adminUI/AdminSomethingWentWrong';
import FormHeader from '../../../components/UI/FormHeader';
import FormActions from '../../../components/UI/FormActions';
import ChangePasswordModal from '../../../components/admin/Modal/ChangePasswordModal';
import { validateUserForm } from '../../../validators/UserValidators';
import { formatGregorianDateTime, parseISODate } from '../../../utils/dateUtils';

const EditUserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    is_superuser: false,
    is_author: false,
    is_seller: false,
    is_active: false,
    created_date: '',
    updated_date: '',
    last_login: '',
  });
  
  const { 
    data: userDetails,
    isLoading: userDetailsLoading,
    isError: userDetailsError,
    sendRequest: fetchUser,
  } = useAdminHttp(`/api/admin/user-detail/${userId}/`);
  
  const { 
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();
  
  useEffect(() => {
    if (userDetails) {
      const initialFormData = {
        phone_number: userDetails.phone_number || '',
        first_name: userDetails.first_name || '',
        last_name: userDetails.last_name || '',
        is_superuser: userDetails.is_superuser || false,
        is_author: userDetails.is_author || false,
        is_seller: userDetails.is_seller || false,
        is_active: userDetails.is_active,
        created_date: parseISODate(userDetails.created_date),
        updated_date: parseISODate(userDetails.updated_date),
        last_login: parseISODate(userDetails.last_login),
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    }
  }, [userDetails]);
  
  // Live validation using useEffect (for phone_number, first_name, last_name)
  useEffect(() => {
    const newErrors = validateUserForm(formData);
    setErrors(newErrors);
  }, [formData]);

  // Check for changes to enable/disable submit button
  useEffect(() => {
    if (originalData) {
      const changesDetected = Object.keys(formData).some(key => {
        if ([ 'is_active', 'created_date', 'updated_date', 'last_login'].includes(key)) {
          return false;
        }
        return formData[key] !== originalData[key];
      });
      setHasChanges(changesDetected);
    }
  }, [formData, originalData]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: (typeof value === 'boolean' ? value : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if any field has changed
    if (!hasChanges) {
      errorNotif('لطفا حداقل یکی از فیلدها را تغییر دهید.');
      setIsLoading(false);
      return;
    }

    // Final validation before submission (errors state is already updated by useEffect)
    if (Object.keys(errors).some(key => errors[key] && errors[key].length > 0)) {
      setIsLoading(false);
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    const dataToSend = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (originalData[key] !== value && !['is_active', 'created_date', 'updated_date', 'last_login'].includes(key)) {
        dataToSend[key] = value;
      }
    });
    
    try {
      const response = await sendRequest(`/api/admin/user-update/${userId}/`, 'PATCH', dataToSend);
      if (response?.isError) {
        // Set backend errors and merge with any existing ones
        const backendErrors = response?.errorContent || {};
        setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        errorNotif('خطا در بروزرسانی کاربر');
      } else {
        successNotif('اطلاعات کاربر با موفقیت بروزرسانی شد');
        fetchUser(); // Reload user details
        setErrors({}); // Clear frontend errors on successful submission
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
      // Ensure we set errors in a consistent way, preferably from error.response.data if available
      if (error && error.response && error.response.data) {
        setErrors(error.response.data);
      } else if (typeof error === 'object' && error !== null) {
        setErrors(error);
      } else {
        setErrors({ general: 'خطایی رخ داد.' });
      }
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  if (userDetailsLoading) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log(userDetails);
  

  if (userDetails?.errorContent?.detail === "No User matches the given query." || userDetails?.errorContent?.detail === "page not found.") {
    return <AdminSomethingWentWrong message="کاربری با این مشخصات یافت نشد." />;
  }
  
  if (userDetails?.isError) {
    return <AdminSomethingWentWrong />;
  }

  // Check if there are any errors to disable the submit button
  const hasValidationErrors = Object.keys(errors).some(key => {
    const error = errors[key];
    if (Array.isArray(error)) {
      return error.length > 0;
    }
    return !!error; // For non-array errors
  });

  const isSubmitDisabled =  hasValidationErrors || isLoading || submitLoading;

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ویرایش کاربر"
          subtitle="در این صفحه می توانید اطلاعات کاربر را ویرایش کنید"
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
              <h3 className="text-xl font-bold text-primary">اطلاعات عمومی کاربر</h3>
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

                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">گذرواژه</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="********"
                      readOnly
                      className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300 cursor-not-allowed"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={openChangePasswordModal}
                      className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium"
                    >
                      تغییر
                    </button>
                  </div>
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
                  <label className="block text-[16px] text-secondary mb-2 text-right">وضعیت حساب</label>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                    <span className="text-primary font-medium">
                      {formData.is_active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">اطلاعات زمان</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">زمان ثبت نام</label>
                  <input
                    type="text"
                    value={formatGregorianDateTime(formData.created_date)}
                    readOnly
                    className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">آخرین بروزرسانی</label>
                  <input
                    type="text"
                    value={formatGregorianDateTime(formData.updated_date)}
                    readOnly
                    className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">آخرین ورود</label>
                  <input
                    type="text"
                    value={formData.last_login ? formatGregorianDateTime(formData.last_login) : '-'}
                    readOnly
                    className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading || isLoading}
              isSubmitDisabled={isSubmitDisabled}
              submitText="ذخیره تغییرات"
            />
          </motion.form>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
        userId={userId}
      />
    </div>
  );
};

export default EditUserForm; 