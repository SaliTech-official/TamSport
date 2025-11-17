import React from 'react';
import Modal from '../../UI/Modal';
import { AdminIcons } from '../../../data/Icons';

const FinalWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  isConfirming
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="اخطار جدی: غیرفعال سازی اکانت شما"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={isConfirming}
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-quinary-tint-800 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center gap-2"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال تایید...
              </>
            ) : (
              'مطمئن هستم، غیرفعال کن'
            )}
          </button>
        </>
      }
    >
      <div className="flex items-center justify-center gap-3 text-red-500 mb-4">
        <AdminIcons.Warning className="w-8 h-8" />
        <h3 className="text-xl font-bold text-red-500">اخطار آخر</h3>
      </div>
      <p className="text-lg text-secondary text-center py-2">
        با غیرفعال سازی اکانت خود دیگر نمی‌توانید وارد سایت شوید.
        <br />این یعنی باید کاربر ادمین دیگری اکانت شما را بعداً دوباره فعال کند!
      </p>
    </Modal>
  );
};

export default FinalWarningModal; 