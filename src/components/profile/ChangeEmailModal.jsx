import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileModal from './ProfileModal';

export default function ChangeEmailModal({ isOpen, onClose, email }) {
  const { t } = useTranslation('profile');
  const [code, setCode] = useState(['', '', '', '', '']);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleCodeChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 4) inputRefs.current[idx + 1].focus();
    if (!val && idx > 0) inputRefs.current[idx - 1].focus();
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (code.join('') !== '12345') {
      setError(t('profileInvalidCode'));
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(newEmail)) {
      setError(t('profileInvalidEmail'));
      return;
    }
    setError('');
    onClose();
    // Show success notification here if desired
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg font-semibold text-primary mb-2">{t('profileChangeEmail')}</div>
        <div className="text-secondary mb-4">{t('profileEmailCodeMsg')}</div>
        <div className="flex gap-2 justify-center mb-4">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleCodeChange(idx, e.target.value)}
              className="w-10 h-12 text-center text-xl border text-primary border-quaternary-200 rounded-lg focus:border-primary outline-none transition"
            />
          ))}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileNewEmail')}</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-primary border-quaternary-200 focus:border-primary outline-none transition"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-primary text-quinary-tint-800 font-bold shadow hover:bg-primary-tint-100 transition"
        >
          {t('profileSubmit')}
        </button>
      </form>
    </ProfileModal>
  );
}
