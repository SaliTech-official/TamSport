import React, { useReducer, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fakeUsers } from '../../data/fakeUsers'
import { authIcons } from '../../data/Icons'
import Input from '../../components/authentication/common/Input'
import Button from '../../components/authentication/common/Button'
import ErrorMessage from '../../components/authentication/common/ErrorMessage'
import { validatePhone, validatePassword, validateConfirmPassword } from '../../utils/validators'

// Reducer for register state
const registerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      }
    case 'TOGGLE_PASSWORD':
      return {
        ...state,
        showPassword: !state.showPassword
      }
    case 'TOGGLE_CONFIRM_PASSWORD':
      return {
        ...state,
        showConfirmPassword: !state.showConfirmPassword
      }
    case 'VALIDATE':
      const passwordErrors = validatePassword(state.password);
      return {
        ...state,
        phoneError: validatePhone(state.phone),
        passwordLengthError: passwordErrors[0] || '',
        passwordContentError: passwordErrors[1] || '',
        confirmError: validateConfirmPassword(state.password, state.confirm)
      }
    case 'RESET':
      return {
        phone: '',
        password: '',
        confirm: '',
        showPassword: false,
        showConfirmPassword: false,
        phoneError: '',
        passwordLengthError: '',
        passwordContentError: '',
        confirmError: ''
      }
    default:
      return state
  }
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Register states with reducer
  const [registerState, dispatchRegister] = useReducer(registerReducer, {
    phone: '',
    password: '',
    confirm: '',
    showPassword: false,
    showConfirmPassword: false,
    phoneError: '',
    passwordLengthError: '',
    passwordContentError: '',
    confirmError: ''
  });

  // Validate form on input change
  useEffect(() => {
    dispatchRegister({ type: 'VALIDATE' });
  }, [registerState.phone, registerState.password, registerState.confirm]);

  // Check if form has errors
  const isDataEmpty = () => {
    return !registerState.phone || !registerState.password || !registerState.confirm;
  }
  const hasErrors = () => {
    return registerState.phoneError || 
           registerState.passwordLengthError || 
           registerState.passwordContentError || 
           registerState.confirmError;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isDataEmpty() || hasErrors()) return;
    setLoading(true);
    try {
      // Add user to fake users (replace with backend call)
      fakeUsers.push({ phone: registerState.phone, password: registerState.password });
      // Navigate to OTP verification with user data
      navigate('/otp-verification', { 
        state: { 
          phone: registerState.phone 
        } 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[95%] max-w-[1200px] h-[600px] mx-auto mt-8 flex flex-col lg:flex-row shadow-[4px_4px_16px_0_rgba(0,0,0,0.25)] rounded-2xl">
      {/* Welcome Section - Hidden on mobile */}
      <div className={`hidden lg:block w-[780px] h-full bg-gradient-to-br from-primary to-quaternary relative rounded-l-2xl ${isRTL ? 'order-2' : 'order-1'}`}>
        <div className={`absolute top-[96px] ${isRTL ? 'right-[64px]' : 'left-[64px]'}`}>
          <h1 className="text-[48px] font-bold text-quinary-tint-800">
            {t('registerWelcomeTitle', { ns: 'validation' })}
          </h1>
          <p className="text-[24px] font-normal text-quinary-tint-800 mt-4 max-w-[600px] text-justify">
            {t('registerWelcomeDescription', { ns: 'validation' })}
          </p>
        </div>
      </div>

      <div className={`w-full lg:w-[520px] h-full bg-quinary-tint-800 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none flex flex-col items-center p-4 sm:p-8 ${isRTL ? 'order-1 lg:rounded-l-2xl lg:rounded-r-none' : 'order-2'}`}>
        <h2 className="text-[28px] sm:text-[36px] font-bold text-primary mt-[32px]">{t('userRegister', { ns: 'validation' })}</h2>
        <div className="w-full max-w-[400px] flex flex-col items-center">
          {/* Phone Input */}
          <Input
            icon={authIcons.User}
            type="text"
            placeholder={t('phoneNumber', { ns: 'validation' })}
            value={registerState.phone}
            onChange={e => dispatchRegister({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
          />
          {registerState.phoneError && <ErrorMessage message={t('invalidPhoneNumber')} />}

          {/* Password Input */}
          <Input
            icon={authIcons.Lock}
            type={registerState.showPassword ? 'text' : 'password'}
            placeholder={t('password', { ns: 'validation' })}
            value={registerState.password}
            onChange={e => dispatchRegister({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
            showPassword={registerState.showPassword}
            onTogglePassword={() => dispatchRegister({ type: 'TOGGLE_PASSWORD' })}
          />

          {/* Confirm Password Input */}
          <Input
            icon={authIcons.Lock}
            type={registerState.showConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmPassword', { ns: 'validation' })}
            value={registerState.confirm}
            onChange={e => dispatchRegister({ type: 'SET_FIELD', field: 'confirm', value: e.target.value })}
            showPassword={registerState.showConfirmPassword}
            onTogglePassword={() => dispatchRegister({ type: 'TOGGLE_CONFIRM_PASSWORD' })}
          />

          {/* Password Errors */}
          <div className="w-full flex flex-col mt-[14px] gap-1">
            {(() => {
              const errors = [];
              if (registerState.confirmError) errors.push(
                <ErrorMessage key="confirm" message={t('passwordsDoNotMatch')} />
              );
              if (registerState.passwordLengthError) errors.push(
                <ErrorMessage key="length" message={t('passwordLengthError')} />
              );
              if (registerState.passwordContentError) errors.push(
                <ErrorMessage key="content" message={t('passwordContentError')} />
              );
              return errors.slice(0, 2);
            })()}
          </div>

          {/* Register Button */}
          <Button 
            onClick={handleRegister} 
            className="mt-[16px]"
            disabled={isDataEmpty() || hasErrors() || loading}
            loading={loading}
          >
            {t('register', { ns: 'validation' })}
          </Button>

          {/* OR Separator */}
          <div className="flex items-center w-full mt-[24px]">
            <div className="h-[1px] flex-1 bg-primary opacity-40" />
            <span className="mx-4 text-[20px] sm:text-[24px] font-light text-primary">{t('or', { ns: 'validation' })}</span>
            <div className="h-[1px] flex-1 bg-primary opacity-40" />
          </div>

          {/* Login Row */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-[16px]">
            <span className="text-[16px] sm:text-[20px] font-semibold text-primary">{t('alreadyHaveAccount', { ns: 'validation' })}</span>
            <Button onClick={() => navigate('/login')} variant="secondary">{t('login', { ns: 'validation' })}</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 