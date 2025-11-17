/**
 * Team form validation utilities
 */

/**
 * Validate all team form fields and return errors
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing error messages for each invalid field
 */
export const validateTeamForm = (formData) => {
  const errors = {};
  // Validate name fields
  if (!formData.name_fa?.trim()) {
    errors.name_fa = 'لطفا نام تیم را به فارسی وارد کنید';
  }
  if (!formData.name_en?.trim()) {
    errors.name_en = 'لطفا نام تیم را به انگلیسی وارد کنید';
  }
  // Validate image field
  if (!formData.image) {
    errors.image = 'لطفا تصویر تیم را انتخاب کنید';
  }
  return errors;
};

/**
 * Check if all required fields in the form have values
 * @param {Object} formData - The form data to check
 * @returns {Boolean} Whether all fields have values
 */
export const isFormValid = (formData) => {
  return (
    formData.name_fa?.trim() !== '' &&
    formData.name_en?.trim() !== '' &&
    formData.image !== null
  );
};

export default { validateTeamForm, isFormValid }; 