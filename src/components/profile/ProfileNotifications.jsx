import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProfileNotifications({ notif, setNotif }) {
  const { t } = useTranslation('profile');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-quaternary-tint-900 rounded-lg">
        <div className="text-primary font-medium">{t('profileEmailNotifications')}</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notif.email}
            onChange={() => setNotif(n => ({ ...n, email: !n.email }))}
          />
          <div className="w-11 h-6 bg-secondary-tint-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-quaternary-tint-900 rounded-lg">
        <div className="text-primary font-medium">{t('profileSmsNotifications')}</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notif.sms}
            onChange={() => setNotif(n => ({ ...n, sms: !n.sms }))}
          />
          <div className="w-11 h-6 bg-secondary-tint-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );
}
