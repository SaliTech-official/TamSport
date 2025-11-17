// Path: src/pages/blog/PreRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { successNotif, errorNotif } from '../../utils/customNotifs'; // Import errorNotif
import useAdminHttp from '../../hooks/useAdminHttp'; // Import useAdminHttp
import domainUrl from '../../utils/api'; // Import domainUrl

const sportOptions = [
  { value: '', label: '' },
  { value: 'فوتبال', label: 'Football' },
  { value: 'بسکتبال', label: 'Basketball' },
  { value: 'والیبال', label: 'Volleyball' },
  { value: 'تنیس', label: 'Tennis' },
  { value: 'شنا', label: 'Swimming' },
  // Add more as needed
];

export default function PreRegister() {
  const { t, i18n } = useTranslation(['preRegister', 'blog']); // Add 'blog' for 'loading'
  const isRTL = i18n.language === 'fa';
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    fullName: '',
    phone: '',
    age: '',
    sport: '',
  });
  const [errors, setErrors] = useState({});
  const { isLoading, sendRequest } = useAdminHttp(); // Destructure isLoading and sendRequest

  const validate = () => {
    const errs = {};
    if (!fields.fullName.trim()) errs.fullName = t('required');
    else if (fields.fullName.length > 255) errs.fullName = t('fullNameTooLong', { ns: 'preRegister' });

    if (!fields.phone.trim()) errs.phone = t('required');
    else if (!/^(09)\d{9}$/.test(fields.phone)) errs.phone = t('invalidPhoneNumberFormat', { ns: 'preRegister' }); // 11 digits, starts with 09

    if (!fields.age || isNaN(fields.age) || +fields.age < 1) errs.age = t('invalidAge', { ns: 'preRegister' });

    if (!fields.sport) errs.sport = t('required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => { // Made async
    e.preventDefault();

    if (i18n.language === 'en') {
      errorNotif(t('languageChangeRequired', { ns: 'preRegister' }));
      return;
    }

    if (!validate()) return;

    try {
      const response = await sendRequest(`/api/blog/pre-register-player/`, 'POST', fields);
      if (response?.error) { // Check for custom error from backend
        errorNotif(t('sendEmailFailed', { ns: 'preRegister' }));
      } else if (response?.message) { // Check for success message
        successNotif(t('preRegisterSuccess', { ns: 'preRegister' }));
        setTimeout(() => navigate('/'), 1200);
      } else { // Generic error for unexpected response
        errorNotif(t('submissionError', { ns: 'preRegister' }));
      }
    } catch (err) {
      console.error("Submission error:", err);
      errorNotif(t('submissionError', { ns: 'preRegister' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-5"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        noValidate
      >
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">{t('preRegisterTitle', { ns: 'preRegister'}) || 'Pre-Registration'}</h2>
        <div>
          <label className="block text-secondary font-medium mb-1">{t('fullName', { ns: 'preRegister' })}</label>
          <input
            name="fullName"
            type="text"
            value={fields.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-quaternary-200'} focus:border-primary outline-none transition`}
            required
            disabled={i18n.language === 'en'} // Disable input if language is English
          />
          {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName}</span>}
        </div>
        <div>
          <label className="block text-secondary font-medium mb-1">{t('phone', { ns: 'preRegister' })}</label>
          <input
            name="phone"
            type="text"
            value={fields.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-quaternary-200'} focus:border-primary outline-none transition`}
            required
            disabled={i18n.language === 'en'} // Disable input if language is English
          />
          {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
        </div>
        <div>
          <label className="block text-secondary font-medium mb-1">{t('age', { ns: 'preRegister' })}</label>
          <input
            name="age"
            type="number"
            min="1"
            value={fields.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.age ? 'border-red-500' : 'border-quaternary-200'} focus:border-primary outline-none transition`}
            required
            disabled={i18n.language === 'en'} // Disable input if language is English
          />
          {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
        </div>
        <div>
          <label className="block text-secondary font-medium mb-1">{t('sportsField', { ns: 'preRegister' })}</label>
          <select
            name="sport"
            value={fields.sport}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.sport ? 'border-red-500' : 'border-quaternary-200'} focus:border-primary outline-none transition bg-white`}
            required
            disabled={i18n.language === 'en'} // Disable select if language is English
          >
            <option value="">{t('selectSport', { ns: 'preRegister' })}</option>
            {sportOptions.slice(1).map(opt => (
              <option key={opt.value} value={opt.value}>{t(opt.value, { ns: 'preRegister' })}</option>
            ))}
          </select>
          {errors.sport && <span className="text-red-500 text-xs">{errors.sport}</span>}
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-primary text-white font-bold text-lg shadow hover:bg-primary/90 transition-colors duration-200 mt-2"
          disabled={isLoading} // Disable button if loading or language is English
        >
          {isLoading ? ( // Show spinner when loading
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('loading', { ns: 'blog' })}</span>
            </div>
          ) : (
            t('submit', { ns: 'preRegister' })
          )}
        </button>
      </form>
    </motion.div>
  );
}
