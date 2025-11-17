import React from 'react';
import Modal from '../../UI/Modal';

const ActivateUserModal = ({
  isOpen,
  onClose,
  onActivate,
  userName,
  isActivating
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تأیید فعال سازی"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={isActivating}
          >
            صرف نظر
          </button>
          <button
            onClick={onActivate}
            className="px-4 py-2 bg-emerald-600 text-quinary-tint-800 rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center gap-2"
            disabled={isActivating}
          >
            {isActivating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال فعال سازی...
              </>
            ) : (
              'فعال کن'
            )}
          </button>
        </>
      }
    >
      <p className="text-lg text-secondary text-center py-2">
        آیا می‌خواهید کاربر <span className="text-primary">{userName || ''}</span> را فعال کنید؟
        <br />این یعنی کاربر می‌تواند دوباره وارد سایت شود.
      </p>
    </Modal>
  );
};

export default ActivateUserModal; 