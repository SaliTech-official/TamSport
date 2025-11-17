/**
 * Validates phone number format
 * @param {string} phone The phone number to validate
 * @returns {string} Error message or empty string if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return '';
  if (!/^\d{11}$/.test(phone)) return 'invalidPhoneNumber';
  return '';
};

/**
 * Validates if any of the password fields are empty
 * @param {string} currentPassword The current password
 * @param {string} newPassword The new password
 * @param {string} confirmPassword The confirmation of the new password
 * @returns {boolean} True if any password field is empty, false otherwise
 */
export const validateRequirePasswords = (currentPassword, newPassword, confirmPassword) => {
  return !currentPassword || !newPassword || !confirmPassword;
};

/**
 * Validates password requirements
 * @param {string} password The password to validate
 * @returns {array} Array of error messages [length error, content error] or empty strings if valid
 */
export const validatePassword = (password) => {
  const errors = ['', ''];
  if (!password) return errors;
  
  if (password.length < 8) {
    errors[0] = 'passwordLengthError';
  }
  
  else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    errors[1] = 'passwordContentError';
  }
  
  return errors;
};

/**
 * Validates that password confirmation matches password
 * @param {string} password The original password
 * @param {string} confirmation The confirmation password
 * @returns {string} Error message or empty string if valid
 */
export const validateConfirmPassword = (password, confirmation) => {
  if (!confirmation) return '';
  if (password !== confirmation) return 'passwordsDoNotMatch';
  return '';
};

/**
 * Processes Django REST Framework error responses
 * 
 * @param {Object} response - Response object from the backend with error data
 * @param {Object} formData - Form data object with field names as keys
 * @returns {Object} Object with isError flag and errorContent with field-specific or general errors
 */
export const handleBackendErrors = (response, formData) => {
  const errorMessage = response.errorMessage;
  const errorContent = {};
  let hasErrors = false;

  // Process field-specific errors
  if (typeof errorMessage === 'object' && errorMessage !== null) {
    const formFields = Object.keys(formData);

    // Check for field-specific errors that match form fields
    formFields.forEach(field => {
      // Convert formData field names to match backend keys
      // e.g., newPassword -> new_password
      const snakeCaseField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (errorMessage[field]) {
        errorContent[field] = errorMessage[field];
        hasErrors = true;
      } else if (errorMessage[snakeCaseField]) {
        errorContent[field] = errorMessage[snakeCaseField];
        hasErrors = true;
      }
    });

    // Check for non-field errors
    ['non_field_errors', 'detail', 'error'].forEach(errorKey => {
      if (errorMessage[errorKey]) {
        errorContent.general = errorMessage[errorKey];
        hasErrors = true;
      }
    });
  } else if (typeof errorMessage === 'string') {
    // Handle case where the error is a simple string
    errorContent.general = errorMessage;
    hasErrors = true;
  }

  return {
    isError: hasErrors,
    errorContent
  };
};
