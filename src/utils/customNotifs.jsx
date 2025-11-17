import React from 'react';
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../i18n';

// Custom toast configurations based on notification type
const toastConfig = {
  position: i18n.language === 'en' ? "top-right" : "top-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  rtl: i18n.language === 'fa',
};

// Success notification function
export const successNotif = (message, options = {}) => {
  const isRTL = i18n.language === 'fa';
  return toast.success(
    <div
      className={`flex items-stretch w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg border border-quaternary-200 bg-quaternary text-quinary-tint-800 p-0 overflow-hidden flex-row-reverse`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Icon */}
      <div className="flex items-center px-4 py-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" className="fill-quinary-tint-800"/></svg>
      </div>
      {/* Text content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
        <div className="font-bold text-lg mb-1">{message}</div>
      </div>
      {/* Vertical Divider */}
      <div className="w-px bg-quinary-tint-800 mx-0.5 my-2" />
      {/* Close button */}
      <button
        onClick={options.closeToast}
        className={`flex items-center px-3 focus:outline-none text-quinary-tint-800 hover:text-quinary-tint-600 transition-colors duration-150 ${isRTL ? 'ml-0 mr-2' : 'mr-0 ml-2'}`}
        aria-label="Close notification"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" className="fill-quinary-tint-800 hover:fill-quinary-tint-600 transition-all"/></svg>
      </button>
    </div>,
    {
      position: isRTL ? 'top-right' : 'top-left',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      rtl: isRTL,
      style: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 0, background: 'transparent', minWidth: 0 },
      progressStyle: { background: '#fff' },
      closeButton: false,
      icon: false,
    }
  );
};

// Error notification function
export const errorNotif = (message, options = {}) => {
  const isRTL = i18n.language === 'fa';
  return toast.error(
    <div
      className={`flex items-stretch w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg border border-quaternary-200 bg-quaternary text-quinary-tint-800 p-0 overflow-hidden flex-row-reverse`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Icon */}
      <div className="flex items-center px-4 py-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M1 21h22L12 2 1 21z" className="fill-quinary-tint-800"/>
          <path d="M13 16h-2v-5h2v5zm0 3h-2v-2h2v2z" className="fill-quaternary"/>
        </svg>
      </div>
      {/* Text content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
        <div className="font-bold text-lg mb-1">{message}</div>
      </div>
      {/* Vertical Divider */}
      <div className="w-px bg-quinary-tint-800 mx-0.5 my-2" />
      {/* Close button */}
      <button
        onClick={options.closeToast}
        className={`flex items-center px-3 focus:outline-none text-quinary-tint-800 hover:text-quinary-tint-600 transition-colors duration-150 ${isRTL ? 'ml-0 mr-2' : 'mr-0 ml-2'}`}
        aria-label="Close notification"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" className="fill-quinary-tint-800 hover:fill-quinary-tint-600 transition-all"/></svg>
      </button>
    </div>,
    {
      position: isRTL ? 'top-right' : 'top-left',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      rtl: isRTL,
      style: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 0, background: 'transparent', minWidth: 0 },
      progressStyle: { background: '#fff' },
      closeButton: false,
      icon: false,
    }
  );
};

// Info notification function
export const infoNotif = (message, options = {}) => {
  const isRTL = i18n.language === 'fa';
  return toast.info(
    <div
      className={`flex items-stretch w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg border border-quaternary-200 bg-quaternary text-quinary-tint-800 p-0 overflow-hidden flex-row-reverse`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Icon */}
      <div className="flex items-center px-4 py-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v2z" className="fill-quinary-tint-800"/></svg>
      </div>
      {/* Text content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
        <div className="font-bold text-lg mb-1" title={message}>{message}</div>
      </div>
      {/* Vertical Divider */}
      <div className="w-px bg-quinary-tint-800 mx-0.5 my-2" />
      {/* Close button */}
      <button
        onClick={options.closeToast}
        className={`flex items-center px-3 focus:outline-none text-quinary-tint-800 hover:text-quinary-tint-600 transition-colors duration-150 ${isRTL ? 'ml-0 mr-2' : 'mr-0 ml-2'}`}
        aria-label="Close notification"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" className="fill-quinary-tint-800 hover:fill-quinary-tint-600 transition-all"/></svg>
      </button>
    </div>,
    {
      position: isRTL ? 'top-right' : 'top-left',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      rtl: isRTL,
      style: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 0, background: 'transparent', minWidth: 0 },
      progressStyle: { background: '#fff' },
      closeButton: false,
      icon: false,
    }
  );
};

// This function will update RTL status and position when language changes
export const updateNotifRtl = () => {
  toastConfig.rtl = i18n.language === 'fa';
  toastConfig.position = i18n.language === 'fa' ? "top-left" : "top-right";
};

// Listen to language changes and update RTL setting
i18n.on('languageChanged', () => {
  updateNotifRtl();
});

export default {
  success: successNotif,
  error: errorNotif,
  info: infoNotif,
  updateRtl: updateNotifRtl
};