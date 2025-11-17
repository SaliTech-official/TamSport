import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { validateTeamForm } from '../../../validators/TeamValidators';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import AdminSomethingWentWrong from '../../adminUI/AdminSomethingWentWrong';
import AdminTeamNotFound from '../../adminUI/AdminTeamNotFound';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';

const EditTeamForm = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [formData, setFormData] = useState({ name_fa: '', name_en: '', image: null });
  const [originalData, setOriginalData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [tabErrors, setTabErrors] = useState({ persian: false, english: false });
  const [hasChanges, setHasChanges] = useState(false);

  const {
    isLoading: isFetching,
    isError: fetchError,
    data: teamDetails,
    sendRequest: fetchTeamDetails
  } = useAdminHttp(`/api/admin/team-detail/${teamId}/`);

  const {
    isLoading: submitLoading,
    sendRequest: submitUpdate,
  } = useAdminHttp();

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  useEffect(() => {
    if (teamDetails && teamDetails.id) {
      const initialFormData = {
        name_fa: teamDetails.name_fa || '',
        name_en: teamDetails.name_en || '',
        image: null
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      if (teamDetails.image) setImagePreview(teamDetails.image);
    }
  }, [teamDetails]);

  // Live validation
  useEffect(() => {
    const newErrors = validateTeamForm({ ...formData, image: formData.image || imagePreview });
    setErrors(newErrors);
  }, [formData, imagePreview]);

  useEffect(() => {
    setTabErrors({
      persian: !!errors.name_fa,
      english: !!errors.name_en
    });
  }, [errors]);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  useEffect(() => {
    if (!originalData) {
      setHasChanges(false);
      return;
    }
    const fieldsChanged =
      formData.name_fa !== originalData.name_fa ||
      formData.name_en !== originalData.name_en;
    const imageChanged =
      (formData.image !== null) ||
      (!imagePreview && originalData && originalData.image);
    setHasChanges(fieldsChanged || imageChanged);
  }, [formData, originalData, imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      errorNotif('لطفا حداقل یکی از فیلدها را تغییر دهید.');
      return;
    }

    // Check for validation errors from live validation
    if (Object.keys(errors).length > 0) {
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    const formDataToSend = new FormData();
    // Only append changed fields (excluding image, handled separately)
    Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && originalData[key] !== value) {
            formDataToSend.append(key, value);
        }
    });
    // Handle image separately if changed
    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    try {
      const response = await submitUpdate(`/api/admin/team-update/${teamId}/`, 'PATCH', formDataToSend);
      if (response?.isError) {
        // Set backend errors and merge with any existing ones
        const backendErrors = response?.errorContent || {};
        setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        errorNotif('خطا در بروزرسانی تیم');
      } else {
        successNotif('تیم با موفقیت بروزرسانی شد');
        fetchTeamDetails();
        setErrors({}); // Clear frontend errors on successful submission
      }
    } catch (err) {
      errorNotif('خطا در ارتباط با سرور');
      if (err && err.response && err.response.data) {
        setErrors(err.response.data);
      } else if (typeof err === 'object' && err !== null) {
        setErrors(err);
      } else {
        setErrors({ general: 'خطایی رخ داد.' });
      }
      console.error('Error submitting form:', err);
    }
  };

  const handleBack = () => {
    window.history.back();
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
  console.log(teamDetails);
  
  if (isFetching) return <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (teamDetails?.errorContent?.detail === "page not found.") return <AdminTeamNotFound />;
  if (teamDetails?.isError || fetchError) return <AdminSomethingWentWrong />;

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ویرایش تیم"
          subtitle="در این صفحه می توانید اطلاعات تیم را ویرایش کنید"
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
                  <label className="block text-[16px] text-secondary mb-2 text-right">نام تیم (فارسی)</label>
                  <input
                    type="text"
                    value={formData.name_fa}
                    onChange={e => handleInputChange('name_fa', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام تیم به فارسی"
                    dir="rtl"
                  />
                  {errors.name_fa && <p className="text-red-500 text-sm mt-1">{errors.name_fa}</p>}
                </div>
              )}
              {activeTab === 'english' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-left">Team name (Enlgish) *</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={e => handleInputChange('name_en', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="Team name in English"
                    dir="ltr"
                  />
                  {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
                </div>
              )}
            </div>
            <ImagePicker
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              error={errors.image}
              label="تصویر تیم"
            />
            {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading || isFetching}
              isSubmitDisabled={Object.keys(errors).length > 0 || submitLoading || isFetching}
              submitText="ذخیره تغییرات"
            />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default EditTeamForm; 