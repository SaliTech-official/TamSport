import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export default function ProfileHeader({ user }) {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'fa';
  const fullName = (user.first_name && user.last_name)
    ? `${user.first_name} ${user.last_name}`
    : (isRTL ? t('ProfileGuestUser', { ns: 'blog' }) : t('ProfileGuestUser', { ns: 'blog' }));
  const { logout, isAdminPannelAccess } = useAuth();

  return (
    <div className="flex items-center gap-6 mb-8 justify-between flex-wrap">
      <div className="flex items-center gap-6 min-w-0">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden">
          {/* Replace with <img src={user.photo} ... /> if you have a photo */}
          <FaUserCircle className="text-white text-6xl" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-primary truncate">{fullName}</div>
          <div className="text-secondary text-base truncate">{user.phone_number}</div>
        </div>
      </div>
      <div className="flex gap-3 mt-4 sm:mt-0">
        {isAdminPannelAccess && (
          <a
            href="/admin"
            className="px-5 py-2 rounded-lg bg-secondary text-white font-semibold shadow hover:bg-secondary-tint-200 transition border border-secondary text-base"
            style={{ minWidth: 120 }}
          >
            {t('ProfileAdminPanel', { ns: 'blog' })}
          </a>
        )}
        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition border border-primary text-base"
          style={{ minWidth: 120 }}
        >
          {t('profileLogout')}
        </button>
      </div>
    </div>
  );
}
