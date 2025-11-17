import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProfileSupport() {
  const { t } = useTranslation('profile');
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px]">
      <div className="text-lg font-medium text-secondary opacity-60">
        {t('profileComingSoon')}
      </div>
    </div>
  );
}
