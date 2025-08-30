import React, { useState } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import DeactivateUserModal from '../Modal/DeactivateUserModal';
import ActivateUserModal from '../Modal/ActivateUserModal';
import FinalWarningModal from '../Modal/FinalWarningModal'; // New import
import useAuth from '../../../hooks/useAuth'; // New import

const UsersTable = ({ navigate, users, getUsers, currentPage, totalItems, onPageChangeAfterDeactivate }) => {
  const { user: currentUser } = useAuth(); // Get current logged-in user
  
  // Deactivate user state
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [finalWarningModalOpen, setFinalWarningModalOpen] = useState(false); // New state for final warning modal
  
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [userToActivate, setUserToActivate] = useState(null);
  
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isConfirmingSelfDeactivation, setIsConfirmingSelfDeactivation] = useState(false); // New state for final confirmation

  // Admin HTTP hook for deactivation/activation operation
  const { sendRequest, isLoading: isSendingRequest } = useAdminHttp();

  // Helper to determine if the user being deactivated is the current logged-in user
  const isSelfDeactivation = userToDeactivate && currentUser && userToDeactivate.id === currentUser.id;

  // Handle opening deactivate modal
  const handleOpenDeactivateModal = (user) => {
    setUserToDeactivate(user);
    setDeactivateModalOpen(true);
  };

  // Handle closing deactivate modal
  const handleCloseDeactivateModal = () => {
    setDeactivateModalOpen(false);
    setUserToDeactivate(null);
  };

  // Handle opening activate modal
  const handleOpenActivateModal = (user) => {
    setUserToActivate(user);
    setActivateModalOpen(true);
  };

  // Handle closing activate modal
  const handleCloseActivateModal = () => {
    setActivateModalOpen(false);
    setUserToActivate(null);
  };

  // Handle opening final warning modal for self-deactivation
  const handleConfirmSelfDeactivation = () => {
    setDeactivateModalOpen(false); // Close first modal
    setFinalWarningModalOpen(true); // Open final warning modal
  };

  // Handle closing final warning modal
  const handleCloseFinalWarningModal = () => {
    setFinalWarningModalOpen(false);
    setUserToDeactivate(null); // Clear user to deactivate on close
  };

  // Handle actual deactivation after all confirmations (can be called from either modal)
  const handleProceedDeactivation = async (isFinalConfirmation = false) => {
    if (!userToDeactivate) return;
    setIsDeactivating(true);
    setIsConfirmingSelfDeactivation(true); 

    try {
      const url = `/api/admin/user-deactivate/${userToDeactivate.id}/${isFinalConfirmation ? '?force_deactivate=true' : ''}`;
      const response = await sendRequest(url, 'PATCH', { is_active: false });

      if (response && response?.self_deactivation_pending) {
        // If backend indicates self-deactivation needs final confirmation
        setDeactivateModalOpen(false);
        setFinalWarningModalOpen(true);
      } else {
        // Normal deactivation or final confirmation complete
        setDeactivateModalOpen(false);
        setFinalWarningModalOpen(false); 
        setUserToDeactivate(null);
        
        onPageChangeAfterDeactivate();
      }

    } catch (error) {
      console.error('Failed to deactivate user:', error);
    } finally {
      setIsDeactivating(false);
      setIsConfirmingSelfDeactivation(false);
    }
  };

  // Handle user activation
  const handleActivateUser = async () => {
    if (!userToActivate) return;
    setIsActivating(true);

    try {
      await sendRequest(`/api/admin/user-deactivate/${userToActivate.id}/`, 'PATCH', { is_active: true });

      setActivateModalOpen(false);
      setUserToActivate(null);

      onPageChangeAfterDeactivate();

    } catch (error) {
      console.error('Failed to activate user:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ادمین':
        return 'bg-red-600 text-white';
      case 'فروشنده':
        return 'bg-yellow-500 text-gray-900';
      case 'نویسنده':
        return 'bg-blue-500 text-white';
      case 'کاربر عادی':
        return 'bg-gray-400 text-gray-800';
      default:
        return 'bg-gray-400 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Users table */}
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">وضعیت</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">شماره موبایل</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام خانوادگی</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نقش‌ها</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-6 py-4 text-right">
                      <span className={`w-4 h-4 inline-block rounded-full border-2 ${user.is_active ? 'bg-emerald-400 border-emerald-500' : 'bg-rose-400 border-rose-500'}`}></span>
                    </td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{user.phone_number || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{user.first_name || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{user.last_name || '---'}</td>
                    <td className="px-6 py-4 text-right">
                      {Array.isArray(user.permissions) && user.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-start">
                          {user.permissions.map((permission, permIndex) => (
                            <span
                              key={permIndex}
                              className={`px-2 py-1 rounded-full text-[12px] font-medium ${getRoleColor(permission)}`}
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getRoleColor('کاربر عادی')}`}>
                          کاربر عادی
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/admin/users/edit/${user.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        {currentUser && user.id !== currentUser.id && (
                          user.is_active ? (
                            <button
                              onClick={() => handleOpenDeactivateModal(user)}
                              className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300"
                            >
                              غیرفعال سازی
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenActivateModal(user)}
                              className="px-3 py-1 bg-emerald-600 text-quinary-tint-800 rounded hover:bg-emerald-700 transition-colors duration-300"
                            >
                              فعال سازی
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-secondary">
                    هیچ کاربری یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate User Modal */}
      <DeactivateUserModal
        isOpen={deactivateModalOpen}
        onClose={handleCloseDeactivateModal}
        onDeactivate={handleProceedDeactivation}
        userName={userToDeactivate ? `${userToDeactivate.first_name || ''} ${userToDeactivate.last_name || ''}`.trim() || userToDeactivate.phone_number : ''}
        isDeactivating={isDeactivating}
        isSelfDeactivation={isSelfDeactivation}
        onConfirmSelfDeactivation={handleConfirmSelfDeactivation}
      />

      {/* Activate User Modal */}
      <ActivateUserModal
        isOpen={activateModalOpen}
        onClose={handleCloseActivateModal}
        onActivate={handleActivateUser}
        userName={userToActivate ? `${userToActivate.first_name || ''} ${userToActivate.last_name || ''}`.trim() || userToActivate.phone_number : ''}
        isActivating={isActivating}
      />

      {/* Final Warning Modal for Self Deactivation */}
      <FinalWarningModal
        isOpen={finalWarningModalOpen}
        onClose={handleCloseFinalWarningModal}
        onConfirm={() => handleProceedDeactivation(true)}
        isConfirming={isConfirmingSelfDeactivation}
      />
    </div>
  );
};

export default UsersTable; 