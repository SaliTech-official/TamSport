import React from 'react';
import Modal from '../../UI/Modal';

const DeactivateUserModal = ({
  isOpen,
  onClose,
  onDeactivate,
  userName,
  isDeactivating,
  isSelfDeactivation, // New prop
  onConfirmSelfDeactivation // New prop for self-deactivation
}) => {
  const title = isSelfDeactivation ? "تأیید غیرفعال سازی اکانت" : "تأیید غیرفعال سازی";
  const message = isSelfDeactivation ? 
    "آیا می‌خواهید اکانت خود را غیرفعال کنید؟ این یعنی دیگر نمی‌توانید وارد سایت شوید." : 
    `آیا می‌خواهید کاربر ${userName || ''} را غیرفعال کنید؟
    <br />این یعنی کاربر دیگر نمی‌تواند وارد سایت شود.`;

  const handleButtonClick = () => {
    if (isSelfDeactivation) {
      onConfirmSelfDeactivation();
    } else {
      onDeactivate();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={isDeactivating}
          >
            صرف نظر
          </button>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-100 transition-colors duration-300 flex items-center gap-2"
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال غیرفعال سازی...
              </>
            ) : (
              'غیرفعال کن'
            )}
          </button>
        </>
      }
    >
      <p className="text-lg text-secondary text-center py-2" dangerouslySetInnerHTML={{ __html: message }} />
    </Modal>
  );
};

export default DeactivateUserModal; 