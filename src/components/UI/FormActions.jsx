import React from 'react';

const FormActions = ({
  onCancel,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
  submitText = 'ایجاد',
  cancelText = 'انصراف'
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || isSubmitDisabled}
        className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
        ) : (
          submitText
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
      >
        {cancelText}
      </button>
    </div>
  );
};

export default FormActions; 