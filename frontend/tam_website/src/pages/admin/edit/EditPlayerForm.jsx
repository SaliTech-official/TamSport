import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import AdminPlayerNotFound from '../../adminUI/AdminPlayerNotFound';
import AdminSomethingWentWrong from '../../adminUI/AdminSomethingWentWrong';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';
import { validatePlayerForm } from '../../../validators/PlayerValidators';

const EditPlayerForm = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [positionOptions, setPositionOptions] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    number: '',
    goals: '',
    games: '',
    position: '',
    image: '',
  });
  
  const {
    data: positions,
  } = useAdminHttp('/api/admin/player-positions/');
  
  const {
    data: playerDetails,
    isLoading: playerDetailsLoading,
    isError: playerDetailsError,
    sendRequest: fetchPlayers,
  } = useAdminHttp(`/api/admin/player-detail/${playerId}/`);
  
  const {
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();
  
  useEffect(() => {
    if (playerDetails) {
      const initialFormData = {
        name_fa: playerDetails.name_fa || '',
        name_en: playerDetails.name_en || '',
        number: playerDetails.number?.toString() || '',
        goals: playerDetails.goals?.toString() || '',
        games: playerDetails.games?.toString() || '',
        position: playerDetails.position || '',
        image: null
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      if (playerDetails.image) {
        setImagePreview(playerDetails.image);
      }
    }
  }, [playerDetails]);
  
  useEffect(() => {
    if (positions) {
      const filteredPositions = { ...positions };
      delete filteredPositions[''];
      setPositionOptions(filteredPositions);
    }
  }, [positions]);

  // Remove centralized useEffect for live validation
  // Validation will now be handled directly in change handlers and on submit.

  useEffect(() => {
    if (originalData) {
      const hasFormChanges = Object.keys(formData).some(key => {
        if (key === 'image') {
          return formData.image !== null;
        }
        return formData[key] !== originalData[key];
      });
      
      const hasImageChanges = 
        (imagePreview === null && playerDetails?.image) ||
        formData.image !== null;
      setHasChanges(hasFormChanges || hasImageChanges);
    }
  }, [formData, originalData, imagePreview, playerDetails]);
  
  const [tabErrors, setTabErrors] = useState({
    persian: false,
    english: false
  });
  
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
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validate only the changed field and update errors
    const newErrors = validatePlayerForm({ [field]: value });
    setErrors(prev => {
      const oldErrors = { ...prev };
      delete oldErrors[field];
      return { ...oldErrors, ...newErrors };
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image: file }));
      // Validate image and update errors
      const newErrors = validatePlayerForm({ image: file });
      setErrors(prev => {
        const oldErrors = { ...prev };
        delete oldErrors.image;
        return { ...oldErrors, ...newErrors };
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Final validation before submission
    const finalValidationErrors = validatePlayerForm({ ...formData, image: formData.image || imagePreview });
    setErrors(finalValidationErrors);
    if (Object.keys(finalValidationErrors).length > 0) { // Only check newly generated errors
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      setIsLoading(false);
      return;
    }

    if (!hasChanges) {
      errorNotif('لطفا حداقل یکی از فیلدها را تغییر دهید.');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Only append fields if they have changed from originalData
      if (key !== 'image' && originalData[key] !== value) {
        formDataToSend.append(key, value);
      }
    });
    // Handle image separately: only append if a new image file is selected
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    } else if (imagePreview === null && playerDetails?.image) {
      // If image was removed
      formDataToSend.append('image', ''); // Send empty string to clear image
    }

    try {
      const response = await sendRequest(`/api/admin/player-update/${playerId}/`, 'PATCH', formDataToSend);
      if (response?.isError) {
        // Set backend errors and merge with any existing ones
        const backendErrors = response?.errorContent || {};
        setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        errorNotif('خطا در بروزرسانی بازیکن');
      } else {
        successNotif('اطلاعات بازیکن با موفقیت بروزرسانی شد');
        setErrors({}); // Clear frontend errors on successful submission
        fetchPlayers(); // Reload player details to update originalData
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

  if (playerDetailsLoading) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (playerDetails?.errorContent?.detail === "No Player matches the given query." || playerDetails?.errorContent?.detail === "page not found.") {
    return <AdminPlayerNotFound />;
  }
  
  if (playerDetails?.isError || positions?.isError || playerDetailsError) {
    return <AdminSomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ویرایش بازیکن"
          subtitle="در این صفحه می توانید اطلاعات بازیکن را ویرایش کنید"
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
              <div className="flex border-b border-quinary-tint-500 justify-between">
               <div>
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
              </div>
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div>
                    <label className="block text-[16px] text-secondary mb-2 text-right">
                      نام بازیکن (فارسی) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name_fa}
                        onChange={(e) => handleInputChange('name_fa', e.target.value)}
                        className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                          errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="نام بازیکن به فارسی"
                        dir="rtl"
                      />
                    </div>
                    {errors.name_fa && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_fa}</p>
                    )}
                  </div>
                )}
                {activeTab === 'english' && (
                  <div>
                    <label className="block text-[16px] text-secondary mb-2 text-right">
                      نام بازیکن (انگلیسی) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => handleInputChange('name_en', e.target.value)}
                        className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                          errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="Player name in English"
                        dir="ltr"
                      />
                    </div>
                    {errors.name_en && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_en}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  شماره پیراهن *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.number ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="شماره پیراهن (1-99)"
                    min="1"
                    max="99"
                  />
                </div>
                {errors.number && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.number}</p>
                )}
              </div>
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  پست بازیکن *
                </label>
                <div className="relative">
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.position ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    <option value="">انتخاب پست بازیکن</option>
                    {Object.entries(positionOptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.position && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.position}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تعداد گل *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.goals ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد گل"
                    min="0"
                  />
                </div>
                {errors.goals && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.goals}</p>
                )}
              </div>
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تعداد بازی *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.games}
                    onChange={(e) => handleInputChange('games', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.games ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد بازی"
                    min="0"
                  />
                </div>
                {errors.games && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.games}</p>
                )}
              </div>
            </div>
            <ImagePicker
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              error={errors.image}
              label="تصویر بازیکن"
            />
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading || isLoading}
              isSubmitDisabled={Object.keys(errors).length > 0 || submitLoading || isLoading || playerDetailsLoading}
              submitText="ذخیره تغییرات"
            />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerForm; 