import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeEmailModal from './ChangeEmailModal';

export default function ProfileSecurity({ user }) {
  const { t } = useTranslation('profile');
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-primary font-medium mb-1">{t('profilePassword')}</label>
        <div className="flex items-center gap-3">
          <input
            type="password"
            value="********"
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 bg-quaternary-tint-900 text-primary"
          />
          <button
            className="px-5 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition w-64"
            onClick={() => setShowPassModal(true)}
          >
            {t('profileChangePassword')}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-primary font-medium mb-1">{t('profileEmail')}</label>
        <div className="flex items-center gap-3">
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 bg-quaternary-tint-900 text-primary"
          />
          <button
            className="px-5 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition w-64"
            onClick={() => setShowEmailModal(true)}
          >
            {t('profileChangeEmail')}
          </button>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        phone={user.phone}
      />
      <ChangeEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={user.email}
      />
    </div>
  );
}
