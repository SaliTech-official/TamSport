import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { validateTeamForm, isFormValid } from '../../../validators/TeamValidators';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';

const TeamForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('persian');
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [tabErrors, setTabErrors] = useState({ persian: false, english: false });
  const { isError, isLoading, sendRequest } = useAdminHttp();

  useEffect(() => {
    setTabErrors({
      persian: !!errors.name_fa,
      english: !!errors.name_en
    });
  }, [errors]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTeamForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.name_fa && activeTab !== 'persian') setActiveTab('persian');
      else if (validationErrors.name_en && activeTab !== 'english') setActiveTab('english');
      return;
    }
    setErrors({});
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    try {
      const response = await sendRequest('/api/admin/team-create/', 'POST', formDataToSend);
      if (response?.isError) {
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد تیم');
      } else {
        successNotif('تیم جدید اضافه شد');
        setTimeout(() => {
          navigate(`/admin/teams/edit/${response.id}`);
        }, 1500);
      }
    } catch (err) {
      errorNotif('خطا در ارتباط با سرور');
    }
  };

  const handleBack = () => {
    navigate("/admin/teams")
  };
  
  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  if (isError) {
    return <SomethingWentWrong />;
  }
  
  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="افزودن تیم جدید"
          subtitle="در این صفحه می توانید تیم جدیدی ایجاد کنید"
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
            <div className="flex border-b border-quinary-tint-500 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 text-[16px] font-medium transition-all duration-300 border-b-2 relative ${
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-secondary border-transparent hover:text-primary hover:border-quinary-tint-400'
                  }`}
                >
                  {tab.label}
                  {activeTab !== tab.id && tabErrors[tab.id] && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-quaternary rounded-full"
                      style={{ animation: 'flash 1s infinite ease-in-out' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'persian' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">نام تیم (فارسی) *</label>
                  <input
                    type="text"
                    value={formData.name_fa}
                    onChange={e => handleInputChange('name_fa', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    dir="rtl"
                    placeholder="نام تیم به فارسی"
                  />
                  {errors.name_fa && <div className="text-red-500 text-sm mt-1">{errors.name_fa}</div>}
                </div>
              )}
              {activeTab === 'english' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-left">Team Name (English) *</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={e => handleInputChange('name_en', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    dir="ltr"
                    placeholder="Team name in English"
                  />
                  {errors.name_en && <div className="text-red-500 text-sm mt-1">{errors.name_en}</div>}
                </div>
              )}
            </div>
            <ImagePicker
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                error={errors.image}
                label="تصویر تیم"
            />
            {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isLoading}
              isSubmitDisabled={Object.keys(errors).length > 0 || isLoading}
              submitText="ایجاد تیم"
            />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default TeamForm; 