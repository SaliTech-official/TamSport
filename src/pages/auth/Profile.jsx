import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfoForm from '../../components/profile/ProfileInfoForm';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import useAdminHttp from '../../hooks/useAdminHttp';
import { errorNotif } from '../../utils/customNotifs';
import SomethingWentWrong from '../UI/SomethingWentWrong';
import SpinLoader from '../UI/SpinLoader';
import { API_PREFIX } from '../../reverse_proxy';

export default function Profile() {
  const { t } = useTranslation('profile');

  const [user, setUser] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { data, isLoading, isError, sendRequest } = useAdminHttp(`${API_PREFIX}/auth/user/`);

  useEffect(() => {
    if (data && !data.isError) {
      setUser(data);
    } else if (data && data.isError) {
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
    }
  }, [data, t]);

  const handleUserUpdate = updatedFields => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  if (isLoading || !user) {
    return <SpinLoader />;
  }

  if (isError) {
    return <SomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8 px-2">
      <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <ProfileHeader user={user} />
        <ProfileInfoForm
          user={user}
          onUserUpdate={handleUserUpdate}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        />
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </div>
    </div>
  );
}