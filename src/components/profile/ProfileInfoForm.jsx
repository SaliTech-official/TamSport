import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { validateProfileFormIntl } from '../../validators/UserValidators';
import useAdminHttp from '../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../utils/customNotifs';

export default function ProfileInfoForm({ user, onUserUpdate, onOpenChangePassword }) {
  const { t, i18n } = useTranslation(['profile', 'validation']);
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const { sendRequest, isLoading } = useAdminHttp();

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  // Live validation and change tracking
  const hasChanges = Object.keys(form).some(key => form[key] !== (user[key] || ''));

  useEffect(() => {
    // Re-validate when form data changes
    const runValidation = async () => {
      const newErrors = validateProfileFormIntl(form, t);
      setErrors(newErrors);
    };
    runValidation();
  }, [form, t]);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setBackendError('');
  };

  const handleSave = async e => {
    e.preventDefault();

    const validationErrors = validateProfileFormIntl(form, t);
    setErrors(validationErrors);
    setBackendError('');

    if (Object.keys(validationErrors).length > 0) {
      errorNotif(t('validation:formErrors'));
      return;
    }

    if (!hasChanges) {
      errorNotif(t('validation:noChanges'));
      return;
    }

    try {
      const res = await sendRequest(
        'http://localhost:8000/api/blog/profile/update/', // Changed API endpoint to blog app
        'PATCH',
        form
      );
      if (res && !res.isError) {
        successNotif(t('profileSaveSuccess'));
        onUserUpdate(res);
      } else {
        setErrors(res?.errorContent || {});
        errorNotif(t('somethingWentWrong', { ns: 'blog' }));
        setBackendError(res?.errorContent?.detail || t('somethingWentWrong', { ns: 'blog' }));
      }
    } catch (err) {
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
      console.error('Error submitting profile form:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        setBackendError(err.response.data.detail || t('somethingWentWrong', { ns: 'blog' }));
      } else if (typeof err === 'object' && err !== null) {
        setBackendError(err.message || t('somethingWentWrong', { ns: 'blog' }));
      } else {
        setBackendError(t('somethingWentWrong', { ns: 'blog' }));
      }
    }
  };

  const isSubmitDisabled = Object.keys(errors).length > 0 || !hasChanges || isLoading;

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileFirstName')}</label>
          <input
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary ${errors.first_name ? 'border-red-500' : ''}`}
          />
          {errors.first_name && <div className="text-red-600 text-xs mt-1">{errors.first_name}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileLastName')}</label>
          <input
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary ${errors.last_name ? 'border-red-500' : ''}`}
          />
          {errors.last_name && <div className="text-red-600 text-xs mt-1">{errors.last_name}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profilePhone')}</label>
          <input
            name="phone_number"
            type="text"
            value={user.phone_number || ''}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 text-primary-tint-500 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profilePassword')}</label>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            <input
              type="password"
              value="********"
              disabled
              className="h-10 px-4 rounded-lg border border-quaternary-200 text-primary-tint-500 cursor-not-allowed bg-gray-100 w-full sm:flex-1 min-w-0 sm:min-w-[180px]"
            />
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="h-10 px-4 inline-flex items-center justify-center whitespace-nowrap bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium text-sm shrink-0 w-full sm:w-auto"
            >
              {t('profileChangePassword')}
            </button>
          </div>
        </div>
      </div>
      {backendError && <div className="text-red-600 text-sm mt-2">{backendError}</div>}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`px-6 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? t('loading', { ns: 'blog' }) : t('profileSave')}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm({ first_name: user.first_name || '', last_name: user.last_name || '' });
            setErrors({});
            setBackendError('');
          }}
          className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold shadow hover:bg-quaternary-tint-900 transition"
        >
          {t('profileDiscard')}
        </button>
      </div>
    </form>
  );
}
