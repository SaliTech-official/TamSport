import i18n from '../i18n';

export const validateUserForm = (formData) => {
  const errors = {};

  // Validate phone_number
  if (!formData.phone_number) {
    errors.phone_number = 'شماره موبایل الزامی است.';
  } else if (!/^09\d{9}$/.test(formData.phone_number)) {
    errors.phone_number = 'شماره موبایل نامعتبر است!';
  }

  // Validate first_name
  if (formData.first_name && formData.first_name.length > 150) {
    errors.first_name = 'نام نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد.';
  }

  // Validate last_name
  if (formData.last_name && formData.last_name.length > 150) {
    errors.last_name = 'نام خانوادگی نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد.';
  }

  return errors;
};

export const validateStrongPassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push(i18n.t('validation:passwordLengthError'));
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(i18n.t('validation:passwordUppercaseError'));
  }
  if (!/[a-z]/.test(password)) {
    errors.push(i18n.t('validation:passwordLowercaseError'));
  }
  if (!/[0-9]/.test(password)) {
    errors.push(i18n.t('validation:passwordNumberError'));
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(i18n.t('validation:passwordSpecialCharError'));
  }
  return errors;
};

export const validateChangePassword = (newPassword, repeatPassword) => {
  const errors = {};
  
  if (!newPassword) {
    errors.new_password = 'گذرواژه جدید الزامی است.';
  }
  if (!repeatPassword) {
    errors.repeat_password = 'تکرار گذرواژه الزامی است.';
  }
  
  if (newPassword && repeatPassword && newPassword !== repeatPassword) {
    errors.repeat_password = 'گذرواژه‌ها یکسان نیستند.';
  }

  if (newPassword) {
    const strongPasswordErrors = validateStrongPassword(newPassword);
    if (strongPasswordErrors.length > 0) {
      errors.new_password = strongPasswordErrors; // Assign the array directly
    }
  }
  
  return errors;
}; 

export const validateProfileFormIntl = (formData, t) => {
  const errors = {};
  // Validate first_name
  if (formData.first_name && formData.first_name.length > 150) {
    errors.first_name = t('validation:profileFirstNameMax', { max: 150 });
  }
  // Validate last_name
  if (formData.last_name && formData.last_name.length > 150) {
    errors.last_name = t('validation:profileLastNameMax', { max: 150 });
  }
  return errors;
};

export const validateProfileChangePasswordIntl = (fields, t) => {
  const errors = {};
  if (!fields.old_password) {
    errors.old_password = t('validation:profilePasswordRequired');
  }
  if (!fields.new_password) {
    errors.new_password = t('validation:profilePasswordRequired');
  }
  if (!fields.confirm_password) {
    errors.confirm_password = t('validation:profilePasswordRequired');
  }
  if (fields.new_password && fields.confirm_password && fields.new_password !== fields.confirm_password) {
    errors.confirm_password = t('validation:passwordsDoNotMatch');
  }
  if (fields.new_password) {
    const strongPasswordErrors = validateStrongPassword(fields.new_password);
    if (strongPasswordErrors.length > 0) {
      errors.new_password = strongPasswordErrors;
    }
  }
  return errors;
}; 