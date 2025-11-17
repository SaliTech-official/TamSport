import React, { useReducer, useEffect, useContext, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Modal from '../../components/blog/Modal'
import { AuthContext } from '../../context/AuthContext'
import { authIcons } from '../../data/Icons'

// OTP state reducer
const otpReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIGIT':
      const newDigits = [...state.digits]
      newDigits[action.index] = action.value
      return {
        ...state,
        digits: newDigits,
        otp: newDigits.join('')
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.value
      }
    case 'DECREMENT_TIMER':
      return {
        ...state,
        timer: state.timer > 0 ? state.timer - 1 : 0,
        resendActive: state.timer === 0
      }
    case 'RESET':
      return {
        digits: ['', '', '', '', ''],
        otp: '',
        error: '',
        timer: 120,
        resendActive: false
      }
    default:
      return state
  }
}

export default function OtpVerification() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  
  // Get user data passed from Register page
  const phone = location.state?.phone;
  
  // If no phone number is provided, redirect to register
  useEffect(() => {
    if (!phone) {
      navigate('/register');
    }
  }, [phone, navigate]);

  // OTP states with reducer
  const [otpState, dispatchOtp] = useReducer(otpReducer, {
    digits: ['', '', '', '', ''],
    otp: '',
    error: '',
    timer: 120,
    resendActive: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const otpInputs = [0, 1, 2, 3, 4];
  const otpRefs = otpInputs.map(() => useRef(null));
  const OTP_CODE = '12345'; // Hardcoded for demo

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      dispatchOtp({ type: 'DECREMENT_TIMER' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (otpState.digits.every(d => d.length === 1)) {
      setTimeout(() => {
        document.getElementById('otp-form')?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }, 100);
    }
  }, [otpState.digits]);

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpState.otp === OTP_CODE) {
      setUser({ phone });
      setIsModalOpen(true);
    } else {
      dispatchOtp({ type: 'SET_ERROR', value: 'Invalid OTP code' });
    }
  }

  const handleResendOtp = () => {
    dispatchOtp({ type: 'RESET' });
  }

  const handleOtpDigitChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    dispatchOtp({ type: 'SET_DIGIT', index: idx, value: val });
    if (val && idx < 4 && otpRefs[idx + 1]?.current) {
      otpRefs[idx + 1].current.focus();
    }
  }

  const handleOtpDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpState.digits[idx] && idx > 0 && otpRefs[idx - 1]?.current) {
      otpRefs[idx - 1].current.focus();
    }
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/');
        }}
        data={{
          title: t('registerSuccessTitle'),
          content: t('registerSuccessContent'),
          onlyAcceptable: true
        }}
      />
      <div className="w-[95%] max-w-[1200px] h-[600px] mx-auto mt-8 flex flex-col lg:flex-row shadow-[4px_4px_16px_0_rgba(0,0,0,0.25)] rounded-2xl">
        {/* Welcome Section - Hidden on mobile */}
        <div className={`hidden lg:block w-[780px] h-full bg-gradient-to-br from-primary to-quaternary relative rounded-l-2xl ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className={`absolute top-[96px] ${isRTL ? 'right-[64px]' : 'left-[64px]'}`}>
            <h1 className="text-[48px] font-bold text-quinary-tint-800">
              {t('otpWelcomeTitle')}
            </h1>
            <p className="text-[24px] font-normal text-quinary-tint-800 mt-4 max-w-[600px]">
              {t('otpWelcomeDescription')}
            </p>
          </div>
        </div>

        <div className={`w-full lg:w-[520px] h-full bg-quinary-tint-800 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none flex flex-col items-center p-4 sm:p-8 ${isRTL ? 'order-1 lg:rounded-l-2xl lg:rounded-r-none' : 'order-2'}`}>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-primary mt-[32px]">{t('otpVerification')}</h2>
          <div className="w-full max-w-[400px] mt-[32px] flex flex-col items-center">
            <span className="text-[16px] sm:text-[18px] text-primary mb-4">{t('otpEnterCode')}</span>
            <form id="otp-form" onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center">
              {/* OTP Inputs */}
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-center gap-2 sm:gap-4 mb-4`}>
                {otpInputs.map((idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    dir="ltr"
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-[24px] sm:text-[28px] font-bold rounded-xl border-2 border-quaternary-tint-800 bg-quaternary-tint-800 text-primary focus:border-primary outline-none transition-all duration-200 shadow-[2px_2px_8px_0_rgba(0,0,0,0.10)]"
                    value={otpState.digits[idx]}
                    onChange={e => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpDigitKeyDown(idx, e)}
                  />
                ))}
              </div>
              {otpState.error && (
                <div className={`flex items-center ${isRTL ? 'mr-2 sm:mr-4' : 'ml-2 sm:ml-4'}`}>
                  <authIcons.Error />
                  <span className={`${isRTL ? 'mr-1' : 'ml-1'} text-[14px] sm:text-[16px] font-normal text-quaternary`}>{t('invalidOtpCode')}</span>
                </div>
              )}
              {/* Timer */}
              <div className="flex flex-col items-center mt-4 mb-2">
                <div className="relative flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="26" stroke="#E0E7EF" strokeWidth="4" fill="none" />
                    <circle
                      cx="28" cy="28" r="26"
                      stroke="#980B1C"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={(2 * Math.PI * 26) * (1 - otpState.timer / 120)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="absolute text-[10px] sm:text-[12px] font-bold text-primary">
                    {Math.floor(otpState.timer/60).toString().padStart(2,'0')}:{(otpState.timer%60).toString().padStart(2,'0')}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={!otpState.resendActive} 
                  className={`mt-2 text-primary text-[14px] sm:text-[16px] font-semibold transition-opacity ${otpState.resendActive ? '' : 'opacity-40 cursor-not-allowed'}`}
                >
                  {t('resendCode')}
                </button>
              </div>
              <button 
                type="submit" 
                className="w-[150px] h-[39px] mt-[32px] bg-gradient-to-br from-primary to-quaternary rounded-[45px] text-white text-[16px] font-semibold flex items-center justify-center transition-all duration-300 hover:from-quaternary hover:to-primary"
              >
                {t('verify')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
} 