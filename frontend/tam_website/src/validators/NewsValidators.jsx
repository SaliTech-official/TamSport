/**
 * Article form validation utilities
 */

/**
 * Validate all article form fields and return errors
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing error messages for each invalid field
 */
export const validateNewsForm = (formData, articleDetails={}) => {
  const errors = {};
  
  // Validate title fields
  if (Object.keys(formData).includes('title_fa') && !formData.title_fa?.trim()) {
    errors.title_fa = 'لطفا عنوان مقاله را به فارسی وارد کنید';
  }
  
  if (Object.keys(formData).includes('title_en') && !formData.title_en?.trim()) {
    errors.title_en = 'لطفا عنوان مقاله را به انگلیسی وارد کنید';
  }
  
  // Validate body fields
  if (Object.keys(formData).includes('body_fa') && !formData.body_fa?.trim()) {
    errors.body_fa = 'لطفا متن مقاله را به فارسی وارد کنید';
  }
  
  if (Object.keys(formData).includes('body_en') && !formData.body_en?.trim()) {
    errors.body_en = 'لطفا متن مقاله را به انگلیسی وارد کنید';
  }
  
  // Validate team field
  if (Object.keys(formData).includes('team') && !formData.team) {
    errors.team = 'لطفا تیم را انتخاب کنید';
  }
  
  // Validate video URL for video type articles
  if (Object.keys(formData).includes('type') && formData.type === 'VD' && !formData.video_url?.trim()) {
    errors.video_url = 'لطفا آدرس ویدیو را وارد کنید';
  }
  
  // Validate main image
  if (Object.keys(formData).includes('main_image') && !formData.main_image) {
    errors.main_image = 'لطفا تصویر اصلی مقاله را انتخاب کنید';
  }
  
  // Validate slideshow images for slideshow type articles
  if (Object.keys(formData).includes('type') && formData.type === 'SS' && (!formData.slideshow_images || formData.slideshow_images.length < 1) && articleDetails.slideshow_images.length < 1) {
    errors.slideshow_images = 'لطفا حداقل یک تصویر برای اسلایدشو انتخاب کنید';
  }
  
  return errors;
};

/**
 * Check if all required fields in the form have values
 * @param {Object} formData - The form data to check
 * @returns {Boolean} Whether all fields have values
 */
export const isFormValid = (formData) => {
  const hasRequiredFields = 
    formData.title_fa?.trim() !== '' && 
    formData.title_en?.trim() !== '' && 
    formData.body_fa?.trim() !== '' && 
    formData.body_en?.trim() !== '' && 
    formData.team !== '' &&
    formData.status !== '' &&
    formData.type !== '' &&
    formData.main_image !== null;
    
  // Check type-specific requirements
  if (!hasRequiredFields) return false;
  
  if (formData.type === 'VD' && formData.video_url?.trim() === '') {
    return false;
  }
  
  if (formData.type === 'SS' && (!formData.slideshow_images || formData.slideshow_images.length < 1)) {
    return false;
  }
  
  return true;
};
  
export default { validateNewsForm, isFormValid }; 