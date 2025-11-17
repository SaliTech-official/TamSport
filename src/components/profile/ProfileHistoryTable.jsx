import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProfileHistoryTable({ user }) {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'fa';
  const fullName = (user.firstName && user.lastName)
    ? `${user.firstName} ${user.lastName}`
    : (isRTL ? 'کاربر میهمان' : 'Guest User');

  return (
    <div>
      <div className="mb-6 text-lg font-medium text-primary">
        {isRTL
          ? `سلام ${fullName} عزیز! از اینجا می‌تونی تاریخچه پیش‌ثبت‌نام‌هات رو پیگیری کنی.`
          : `Hello ${fullName}! From here you can track your class pre-registration history.`}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-primary-tint-200 rounded-lg">
          <thead>
            <tr className="bg-primary-tint-100 text-quinary-tint-800">
              <th className="px-4 py-2">{t('profileRow')}</th>
              <th className="px-4 py-2">{t('profileSport')}</th>
              <th className="px-4 py-2">{t('profileDate')}</th>
            </tr>
          </thead>
          <tbody>
            {user.preRegisterHistory.map((item, idx) => (
              <tr key={idx} className="text-center border-t border-primary-tint-100 text-primary">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.sport}</td>
                <td className="px-4 py-2">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
