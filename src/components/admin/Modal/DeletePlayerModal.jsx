import React from 'react';
import Modal from '../../UI/Modal';

const DeletePlayerModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  playerName, 
  isDeleting 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تأیید حذف"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={isDeleting}
          >
            صرف نظر
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-100 transition-colors duration-300 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال حذف...
              </>
            ) : (
              'بله'
            )}
          </button>
        </>
      }
    >
      <p className="text-lg text-secondary text-center py-2">
        آیا قصد حذف بازیکن <span className="text-primary">{playerName || ''}</span> را دارید؟
      </p>
    </Modal>
  );
};

export default DeletePlayerModal; 