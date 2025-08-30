import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileModal from './ProfileModal';
import { validateStrongPassword } from '../../validators/UserValidators';
import useAdminHttp from '../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../utils/customNotifs';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { t } = useTranslation(['profile', 'validation']);
  const [fields, setFields] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const { sendRequest, isLoading } = useAdminHttp();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setBackendError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Frontend validation: strong password + equality only
    const nextErrors = {};
    const strongErrors = validateStrongPassword(fields.new_password || '');
    if (strongErrors.length > 0) {
      nextErrors.new_password = strongErrors;
    }
    if ((fields.new_password || '') !== (fields.confirm_password || '')) {
      nextErrors.confirm_password = t('validation:passwordsDoNotMatch');
    }

    setErrors(nextErrors);
    setBackendError('');

    if (Object.values(nextErrors).some(Boolean)) {
      errorNotif(t('validation:formErrors'));
      return;
    }

    try {
      const payload = { old_password: fields.old_password, new_password: fields.new_password };
      const res = await sendRequest(
        '/api/blog/change_password/',
        'PATCH',
        payload
      );
      if (res && !res.isError) {
        successNotif(t('profileModalChangePasswordSuccess'));
        onClose();
        setFields({ old_password: '', new_password: '', confirm_password: '' });
        setErrors({});
      } else {
        setErrors(res?.errorContent || {});
        errorNotif(t('somethingWentWrong', { ns: 'blog' }));
        setBackendError(res?.errorContent?.detail || t('somethingWentWrong', { ns: 'blog' }));
      }
    } catch (err) {
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
      console.error('Error submitting change password form:', err);
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

  const hasErrors = Object.values(errors).some(Boolean);
  const isSubmitDisabled = hasErrors || isLoading;

  const renderError = (err) => {
    if (!err) return null;
    return Array.isArray(err) ? (
      <ul className="text-red-600 text-xs mt-1 list-disc pr-5">
        {err.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
    ) : (
      <div className="text-red-600 text-xs mt-1">{err}</div>
    );
  };

  const EyeIcon = ({ crossed = false }) => (
    crossed ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  );

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg font-semibold text-primary mb-2">{t('profileChangePassword')}</div>

        <div>
          <label className="block text-primary font-medium mb-1">{t('profileCurrentPassword')}</label>
          <div className={`w-full rounded-lg border ${errors.old_password ? 'border-red-500' : 'border-quaternary-200'} flex items-center px-3` }>
            <button type="button" onClick={() => setShowOld(v => !v)} className="text-primary focus:outline-none">
              <EyeIcon crossed={showOld} />
            </button>
            <input
              name="old_password"
              type={showOld ? 'text' : 'password'}
              value={fields.old_password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none text-primary"
              placeholder={t('profileOldPasswordPlaceholder')}
            />
          </div>
          {renderError(errors.old_password)}
        </div>

        <div>
          <label className="block text-primary font-medium mb-1">{t('profileNewPassword')}</label>
          <div className={`w-full rounded-lg border ${errors.new_password ? 'border-red-500' : 'border-quaternary-200'} flex items-center px-3` }>
            <button type="button" onClick={() => setShowNew(v => !v)} className="text-primary focus:outline-none">
              <EyeIcon crossed={showNew} />
            </button>
            <input
              name="new_password"
              type={showNew ? 'text' : 'password'}
              value={fields.new_password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none text-primary"
              placeholder={t('profileNewPasswordPlaceholder')}
            />
          </div>
          {renderError(errors.new_password)}
        </div>

        <div>
          <label className="block text-primary font-medium mb-1">{t('profileConfirmNewPassword')}</label>
          <div className={`w-full rounded-lg border ${errors.confirm_password ? 'border-red-500' : 'border-quaternary-200'} flex items-center px-3` }>
            <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-primary focus:outline-none">
              <EyeIcon crossed={showConfirm} />
            </button>
            <input
              name="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              value={fields.confirm_password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 outline-none text-primary"
              placeholder={t('profileConfirmNewPasswordPlaceholder')}
            />
          </div>
          {renderError(errors.confirm_password)}
        </div>

        {backendError && <div className="text-red-600 text-sm mt-2">{backendError}</div>}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg bg-primary text-quinary-tint-800 font-bold shadow hover:bg-primary-tint-100 transition ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? t('loading', { ns: 'blog' }) : t('profileSubmit')}
        </button>
      </form>
    </ProfileModal>
  );
}
