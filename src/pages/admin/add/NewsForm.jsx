import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { validateNewsForm } from '../../../validators/NewsValidators';
import QuillEditor from '../../../components/admin/Editor/QuillEditor';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';
import SlideshowImages from '../../../components/admin/SlideshowImages';
import ImportTranslationModal from '../../../components/admin/Modal/ImportTranslationModal';
import SchedulePublishModal from '../../../components/admin/Modal/SchedulePublishModal';
import { ArticleFormIcons } from '../../../data/Icons';
import { formatJalaliDateTime } from '../../../utils/dateUtils';
import { API_PREFIX } from '../../../reverse_proxy';

const NewsForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledPublishDate, setScheduledPublishDate] = useState(null);
  
  const [tabErrors, setTabErrors] = useState({
    persian: false, 
    english: false
  });
  
  const [formData, setFormData] = useState({
    title_fa: '',
    title_en: '',
    body_fa: '',
    body_en: '',
    team: '',
    status: 'DR',
    type: 'TX',
    video_url: '',
    main_image: null,
    slideshow_images: [],
    scheduled_publish_at: null
  });
  
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError
  } = useAdminHttp(`${API_PREFIX}/admin/article-filter-data/`);
  
  const {
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();
  
  // Remove the centralized useEffect for live validation.
  // Validation will now be handled directly in change handlers and on submit.

  useEffect(() => {
    const newTabErrors = {
      persian: !!errors.title_fa || !!errors.body_fa,
      english: !!errors.title_en || !!errors.body_en
    };
    setTabErrors(newTabErrors);
  }, [errors]);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validate only the changed field and update errors
    const newErrorsForField = validateNewsForm({ [field]: value });
    setErrors(prev => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];
      if (newErrorsForField[field]) {
        updatedErrors[field] = newErrorsForField[field];
      }
      // Special handling for video_url as its validation depends on type field
      if (field === 'type') {
        const newErrorsForVideoUrl = validateNewsForm({ type: value, video_url: formData.video_url });
        delete updatedErrors.video_url;
        if (newErrorsForVideoUrl.video_url) {
          updatedErrors.video_url = newErrorsForVideoUrl.video_url;
        }
        // Also re-validate slideshow_images if type changes to SS
        const newErrorsForSlideshow = validateNewsForm({ type: value, slideshow_images: slideshowImages });
        delete updatedErrors.slideshow_images;
        if (newErrorsForSlideshow.slideshow_images) {
          updatedErrors.slideshow_images = newErrorsForSlideshow.slideshow_images;
        }
      }
      return updatedErrors;
    });
  };
  
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, main_image: file }));
      // Validate main_image and update errors
      const newErrorsForImage = validateNewsForm({ main_image: file });
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors.main_image;
        if (newErrorsForImage.main_image) {
          updatedErrors.main_image = newErrorsForImage.main_image;
        }
        return updatedErrors;
      });
    }
  };
  
  const handleSlideshowImageChange = (e) => {
    if (!mainImagePreview) {
      errorNotif('ابتدا باید تصویر اصلی مقاله را انتخاب کنید.');
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newImage = { file, preview: previewUrl, isNew: true };
      const updatedSlideshowImages = [...slideshowImages, newImage];

      setSlideshowImages(updatedSlideshowImages);
      setFormData(prev => ({ ...prev, slideshow_images: [...prev.slideshow_images, file] }));
      
      // Validate slideshow_images and update errors
      const newErrorsForSlideshow = validateNewsForm({ type: formData.type, slideshow_images: updatedSlideshowImages });
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors.slideshow_images;
        if (newErrorsForSlideshow.slideshow_images) {
          updatedErrors.slideshow_images = newErrorsForSlideshow.slideshow_images;
        }
        return updatedErrors;
      });
    }
  };

  const handleRemoveSlideshowImage = (index) => {
    const imageToRemove = slideshowImages[index];
    const updatedSlideshowImages = slideshowImages.filter((_, i) => i !== index);

    setSlideshowImages(updatedSlideshowImages);
    setFormData(prev => {
      const newSlideshowFiles = prev.slideshow_images.filter((_, i) => i !== index);
      return { ...prev, slideshow_images: newSlideshowFiles };
    });

    // Re-validate slideshow_images after removal
    const newErrorsForSlideshow = validateNewsForm({ type: formData.type, slideshow_images: updatedSlideshowImages });
    setErrors(prev => {
      const updatedErrors = { ...prev };
      delete updatedErrors.slideshow_images;
      if (newErrorsForSlideshow.slideshow_images) {
        updatedErrors.slideshow_images = newErrorsForSlideshow.slideshow_images;
      }
      return updatedErrors;
    });
  };

  const handleChangeSlideshowImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        const updatedSlideshowImages = [...slideshowImages];
        updatedSlideshowImages[index] = { id: null, preview: previewUrl, file: file, isNew: true };
        
        setSlideshowImages(updatedSlideshowImages);
        setFormData(prev => ({
          ...prev,
          slideshow_images: [...prev.slideshow_images.filter((_, i) => i !== index), file] // Replace old file with new one in formData
        }));

        // Re-validate slideshow_images after change
        const newErrorsForSlideshow = validateNewsForm({ type: formData.type, slideshow_images: updatedSlideshowImages });
        setErrors(prev => {
          const updatedErrors = { ...prev };
          delete updatedErrors.slideshow_images;
          if (newErrorsForSlideshow.slideshow_images) {
            updatedErrors.slideshow_images = newErrorsForSlideshow.slideshow_images;
          }
          return updatedErrors;
        });
      }
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Final validation before submission (pass full formData for complete validation)
    const finalValidationErrors = validateNewsForm({
        ...formData,
        main_image: formData.main_image || mainImagePreview,
        slideshow_images: slideshowImages.filter(img => img.file).map(img => img.file) // Only new files for validation
    });
    // Additionally validate existing slideshow images if type is 'SS' and no new files were added.
    if (formData.type === 'SS' && (!formData.slideshow_images || formData.slideshow_images.length === 0)) {
        const existingSlideshowCount = slideshowImages.filter(img => !img.isNew).length;
        if (existingSlideshowCount < 1) {
            finalValidationErrors.slideshow_images = 'لطفا حداقل یک تصویر برای اسلایدشو انتخاب کنید';
        }
    }

    setErrors(finalValidationErrors);

    if (Object.keys(finalValidationErrors).length > 0 || Object.keys(errors).length > 0) { // Check both newly generated errors and existing errors state
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      setIsLoading(false);
      return;
    }
    
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'main_image' && key !== 'slideshow_images') {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      }
    });
    
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    
    // Only append newly added slideshow files
    formData.slideshow_images.forEach((image, index) => {
      formDataToSend.append(`slideshow_image_${index}`, image);
    });
    
    formDataToSend.append('slideshow_image_count', formData.slideshow_images.length);

    try {
      const response = await sendRequest(`${API_PREFIX}/admin/article-create/`, 'POST', formDataToSend);
      if (response?.isError) {
        // Set backend errors and merge with any existing ones
        const backendErrors = response?.errorContent || {};
        setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        errorNotif('خطا در ایجاد مقاله');
      } else {
        successNotif('مقاله جدید اضافه شد');
        setErrors({}); // Clear frontend errors on successful submission
        setTimeout(() => {
          navigate(`/admin/news/edit/${response.id}`);
        }, 1500);
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate("/admin/news")
  };
  
  const handleCopyPrompt = () => {
    if (!formData.body_fa || formData.body_fa === '<p><br></p>') {
      errorNotif('ابتدا متن مقاله فارسی را وارد کنید.');
      return;
    }

    const prompt = `=== Prompt Purpose ===Translate the provided Persian article content into natural English, ensuring that all HTML formatting is preserved exactly as presented.\n=== Output Format ===Return the result in .md (Markdown) format. Maintain all headings, bold text, italics, text alignments, links, and other formatting precisely as in the original HTML. Ensure that the formatting applied to specific text in Persian is identically applied to its English translation equivalent. For example, if a word or phrase in Persian is bold, italicized, or linked, the corresponding translated word or phrase in English must retain the same formatting in the same position.\n=== Examples ===Input (Persian with Formatting):\n<p style="text-align: justify;">سلام <a href="www.google.com" rel="noopener noreferrer" target="_blank">دنیا</a>، من یه متن ساختگی هستم که شامل فرمت های زیادی هستم به فارسی و باید به زبان انگلیسی دقیقا به همین فرمت ترجمه بشم، برای مثال اگه <a href="www.google.com" rel="noopener noreferrer" target="_blank">اینجا </a>یه لینک باشه باید توی متن انگلیسی همون قسمت لینک بخوره، یا اگه <strong>اینجا </strong>بولد باشه باید همونجا توی متن فارسی بولد بشه، یا اگه کلمه <em>برنامه نویسی</em> ایتالیک باشه باید توی زبان انگلیسی هم همونجا ایتالیک بشه.</p>\n\nExpected Output (English with Formatting):\n<p style="text-align: justify;">Hello <a href="www.google.com" rel="noopener noreferrer" target="_blank">world</a>, I am a dummy text that contains many formats in Persian and must be translated into English exactly with the same formatting. For example, if a word or phrase in Persian is bold, italicized, or linked, the corresponding translated word or phrase in English must retain the same formatting in the same position.\n=== Persian Article Body (Formatted) ===\nProvide only the prompt text as shown above, without any additional content.\nthe persian text with format is between this >>> <<<:\n>>> ${formData.body_fa} <<< \n    `;
    navigator.clipboard.writeText(prompt).then(() => {
      successNotif('پرامپت ترجمه در کلیپ‌برد کپی شد.');
    }).catch(err => {
      errorNotif('خطا در کپی کردن پرامپت.');
      console.error('Could not copy text: ', err);
    });
  };

  const handleImportTranslation = (importedHtml) => {
    handleInputChange('body_en', importedHtml);
    successNotif('متن ترجمه شده با موفقیت وارد شد.');
  };
  
  const handleSchedulePublication = (scheduledDate) => {
    setScheduledPublishDate(scheduledDate);
    setFormData(prev => ({ ...prev, scheduled_publish_at: scheduledDate.toISOString() }));
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

  if (filterLoading) {
    return <SpinLoader />;
  }

  if (filterError) {
    return <SomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="افزودن مقاله جدید"
          subtitle="در این صفحه می توانید مقاله جدیدی ایجاد کنید"
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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-right">
                        عنوان مقاله (فارسی) *
                      </label>
                      <input
                        type="text"
                        value={formData.title_fa}
                        onChange={(e) => handleInputChange('title_fa', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="عنوان مقاله"
                        dir="rtl"
                      />
                      {errors.title_fa && (
                          <p className="text-quaternary text-[14px] mt-1 text-right">{errors.title_fa}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-right">
                        متن مقاله (فارسی) *
                      </label>
                      <div className={`rounded-lg border-2 ${errors.body_fa ? 'border-quaternary' : 'border-transparent'}`}>
                        <QuillEditor
                          value={formData.body_fa}
                          onChange={(data) => handleInputChange('body_fa', data)}
                          placeholder="متن مقاله خود را اینجا وارد کنید..."
                          isRTL={true}
                        />
                      </div>
                      {errors.body_fa && (
                        <p className="text-quaternary text-[14px] mt-1 text-right">{errors.body_fa}</p>
                      )}
                      <div className="mt-4 flex justify-start">
                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className="flex items-center gap-2 px-4 py-2 bg-quaternary text-white font-semibold rounded-lg hover:bg-quaternary/90 transition-colors duration-300"
                        >
                          <ArticleFormIcons.Copy className="w-5 h-5" />
                          <span>کپی کردن پرامپت ترجمه برای AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'english' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-left">
                        Article Title (English) *
                      </label>
                      <input
                        type="text"
                        value={formData.title_en}
                        onChange={(e) => handleInputChange('title_en', e.target.value)}
                        className={`w-full pr-10 pl-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title_en ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="Article title"
                        dir="ltr"
                      />
                      {errors.title_en && (
                          <p className="text-quaternary text-[14px] mt-1 text-left">{errors.title_en}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-left">
                        Article Body (English) *
                      </label>
                      <div className={`rounded-lg border-2 ${errors.body_en ? 'border-quaternary' : 'border-transparent'}`}>
                        <QuillEditor
                          value={formData.body_en}
                          onChange={(data) => handleInputChange('body_en', data)}
                          placeholder="Enter your article body here..."
                          isRTL={false}
                        />
                      </div>
                      {errors.body_en && (
                        <p className="text-quaternary text-[14px] mt-1 text-left">{errors.body_en}</p>
                      )}
                      <div className="mt-4 flex justify-start">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-quaternary text-white font-semibold rounded-lg hover:bg-quaternary/90 transition-colors duration-300"
                        >
                          <span>وارد کردن متن از طریق کلیپ‌برد</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تیم *
                </label>
                <select
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    errors.team ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                >
                    <option value="">انتخاب تیم</option>
                    {filterData && filterData.teams && Object.entries(filterData.teams).map(([id, name]) => {
                    if (id !== '') {
                        return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                        );
                    }
                    return null;
                    })}
                </select>
                {errors.team && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.team}</p>
                )}
              </div>
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  نوع مقاله *
                </label>
                <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    errors.type ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                >
                    {filterData && filterData.type && Object.entries(filterData.type).map(([id, name]) => {
                    if (id !== '') {
                        return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                        );
                    }
                    return null;
                    })}
                </select>
                {formData.type === 'SS' && (
                <p className="text-yellow-500 text-[14px] text-right mt-1">
                    حتما حداقل دو عکس برای ایجاد مقاله اسلاید شو انتخاب کنید.
                </p>
                )}
                {errors.type && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.type}</p>
                )}
              </div>
              <div className="relative">
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  وضعیت مقاله *
                </label>
                <div className="flex items-center space-x-2">
                  <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.status ? 'border-quaternary' : 'border-quinary-tint-500'
                      } focus:border-primary outline-none transition-colors duration-300`}
                  >
                      {filterData && filterData.status && Object.entries(filterData.status).map(([id, name]) => {
                      if (id !== '') {
                          return (
                          <option key={id} value={id}>
                              {name}
                          </option>
                          );
                      }
                      return null;
                      })}
                  </select>
                  {formData.status === 'DR' && (
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="flex-shrink-0 px-3 py-3 bg-quaternary text-white rounded-lg hover:bg-quaternary/90 transition-colors duration-300 mr-2"
                      title="زمان‌بندی انتشار"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.status && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.status}</p>
                )}
                {scheduledPublishDate && formData.status === 'DR' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-600 text-sm">
                      زمان‌بندی شده برای انتشار در: {formatJalaliDateTime(scheduledPublishDate)}
                    </p>
                  </div>
                )}
              </div>
              {formData.type === 'VD' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">
                      آدرس ویدیو *
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange('video_url', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.video_url ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="https://..."
                    dir="ltr"
                  />
                  {errors.video_url && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.video_url}</p>
                  )}
                </div>
              )}
            </div>
            <ImagePicker
              imagePreview={mainImagePreview}
              onImageChange={handleMainImageChange}
              error={errors.main_image}
              label="تصویر اصلی مقاله"
            />
            {formData.type === 'SS' && (
              <SlideshowImages
                images={slideshowImages}
                onAddImage={handleSlideshowImageChange}
                onRemoveImage={handleRemoveSlideshowImage}
                onChangeImage={handleChangeSlideshowImage}
                error={errors.slideshow_images}
              />
            )}
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading || isLoading}
              isSubmitDisabled={Object.keys(errors).length > 0 || submitLoading || isLoading || filterLoading}
              submitText="ایجاد مقاله"
            />
          </motion.form>
        </div>
      </div>
      <ImportTranslationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImportTranslation}
      />
      <SchedulePublishModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        articleId={null} // For new articles, we'll handle scheduling in the form submission
        onSuccess={handleSchedulePublication}
      />
    </div>
  );
};

export default NewsForm; 