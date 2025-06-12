import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { fakeUsers } from '../data/fakeUsers'
import Modal from '../components/Modal'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

// Validation functions
const validatePhone = (phone) => {
  if (phone.length === 0) return 'Your Phone Number is Invalid'
  if (phone.length !== 11 || !phone.startsWith('09')) return 'Your Phone Number is Invalid'
  return ''
}

const validatePassword = (password) => {
  const errors = []
  if (password.length > 0 && password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (password.length > 0 && !(/[a-zA-Z]/.test(password) && /\d/.test(password))) {
    errors.push('Use letters and numbers')
  }
  return errors
}

const validateConfirmPassword = (password, confirm) => {
  if (password.length > 0 && confirm.length > 0 && password !== confirm) {
    return 'Passwords do not match'
  }
  return ''
}

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
      return {
        ...state,
        phoneError: validatePhone(state.phone),
        passwordLengthError: validatePassword(state.password)[0] || '',
        passwordContentError: validatePassword(state.password)[1] || '',
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

// Reducer for OTP state
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
    case 'SET_STEP':
      return {
        ...state,
        step: action.value
      }
    case 'RESET':
      return {
        step: false,
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

// Extracted SVG Icons
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32} className="text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  EyeSlash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  Error: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-quaternary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  ),
  Checked: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  ),
  Unchecked: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

// Extracted Input Component
const Input = React.memo(({ icon: Icon, type, placeholder, value, onChange, showPassword, onTogglePassword }) => (
  <div className="w-[400px] h-[54px] bg-quaternary-tint-800 rounded-[100px] mt-2 flex items-center px-6 shadow-[2px_2px_8px_0_rgba(0,0,0,0.25)]">
    <Icon />
    <input
      type={type}
      placeholder={placeholder}
      className="ml-4 bg-transparent outline-none text-primary text-[20px] font-normal w-full placeholder:text-primary"
      value={value}
      onChange={onChange}
    />
    {onTogglePassword && (
      <button onClick={onTogglePassword} className="ml-4 text-primary">
        {showPassword ? <Icons.EyeSlash /> : <Icons.Eye />}
      </button>
    )}
  </div>
))

// Extracted Error Message Component
const ErrorMessage = React.memo(({ message }) => (
  <div className="flex items-center ml-4">
    <Icons.Error />
    <span className="ml-1 text-[16px] font-normal text-quaternary">{message}</span>
  </div>
))

// Extracted Button Component
const Button = React.memo(({ onClick, children, variant = 'primary', className = '' }) => {
  const baseClasses = "w-[150px] h-[39px] rounded-[45px] text-[16px] font-semibold flex items-center justify-center transition-all duration-300"
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-br from-primary to-quaternary text-white hover:from-quaternary hover:to-primary"
    : "box-border border-2 border-primary text-primary hover:bg-primary hover:text-white"
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  )
})

export default function Login() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { login, register: registerUser, user, setUser, clearAllData } = useAuth();
  const navigate = useNavigate();
  
  // Login states
  const [loginState, setLoginState] = useState({
    phone: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    error: false
  })

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
  })

  // OTP states with reducer
  const [otpState, dispatchOtp] = useReducer(otpReducer, {
    step: false,
    digits: ['', '', '', '', ''],
    otp: '',
    error: '',
    timer: 120,
    resendActive: false
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const otpInputs = [0, 1, 2, 3, 4]
  const otpRefs = useMemo(() => otpInputs.map(() => React.createRef()), [])
  const OTP_CODE = '12345'

  // Memoized validation
  const registerValidation = useMemo(() => ({
    hasErrors: () => {
      return registerState.phoneError || 
             registerState.passwordLengthError || 
             registerState.passwordContentError || 
             registerState.confirmError || 
             !registerState.phone || 
             !registerState.password || 
             !registerState.confirm
    }
  }), [registerState])

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      setUser(JSON.parse(rememberedUser))
      navigate('/')
    }
  }, [setUser, navigate])

  useEffect(() => {
    if (!otpState.step) return
    const interval = setInterval(() => {
      dispatchOtp({ type: 'DECREMENT_TIMER' })
    }, 1000)
    return () => clearInterval(interval)
  }, [otpState.step])

  useEffect(() => {
    if (otpState.step && otpState.digits.every(d => d.length === 1)) {
      setTimeout(() => {
        document.getElementById('otp-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      }, 100)
    }
  }, [otpState.digits, otpState.step])

  useEffect(() => {
    if (!isRegister) return
    dispatchRegister({ type: 'VALIDATE' })
  }, [isRegister, registerState.phone, registerState.password, registerState.confirm])

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    const success = await login(loginState.phone, loginState.password);
    if (success) {
      if (loginState.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ phone: loginState.phone }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      setIsModalOpen(true);
      setLoginState(prev => ({ ...prev, error: false }));
    } else {
      setLoginState(prev => ({ ...prev, error: true }));
    }
  }, [loginState.phone, loginState.password, loginState.rememberMe, login]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (registerValidation.hasErrors()) return;
    
    const success = await registerUser(registerState.phone, registerState.password);
    if (success) {
      dispatchOtp({ type: 'SET_STEP', value: true });
    }
  }, [registerState, registerValidation, registerUser]);

  const handleOtpSubmit = useCallback((e) => {
    e.preventDefault()
    if (otpState.otp === OTP_CODE) {
      setUser({ phone: registerState.phone })
      setIsModalOpen(true)
      setIsRegister(false)
      dispatchOtp({ type: 'RESET' })
      dispatchRegister({ type: 'RESET' })
    } else {
      dispatchOtp({ type: 'SET_ERROR', value: 'Invalid OTP code' })
    }
  }, [otpState.otp, registerState.phone, setUser])

  const handleResendOtp = useCallback(() => {
    dispatchOtp({ type: 'RESET' })
  }, [])

  const handleOtpDigitChange = useCallback((idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    dispatchOtp({ type: 'SET_DIGIT', index: idx, value: val })
    if (val && idx < 4 && otpRefs[idx + 1]?.current) {
      otpRefs[idx + 1].current.focus()
    }
  }, [otpRefs])

  const handleOtpDigitKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace' && !otpState.digits[idx] && idx > 0 && otpRefs[idx - 1]?.current) {
      otpRefs[idx - 1].current.focus()
    }
  }, [otpState.digits, otpRefs])

  // Memoized components
  const renderLoginForm = useMemo(() => (
    <>
      <h2 className="text-[36px] font-bold text-primary mt-16">User Login</h2>
      
      <Input
        icon={Icons.User}
        type="text"
        placeholder="Phone Number"
        value={loginState.phone}
        onChange={e => setLoginState(prev => ({ ...prev, phone: e.target.value }))}
      />

      <Input
        icon={Icons.Lock}
        type={loginState.showPassword ? "text" : "password"}
        placeholder="Password"
        value={loginState.password}
        onChange={e => setLoginState(prev => ({ ...prev, password: e.target.value }))}
        showPassword={loginState.showPassword}
        onTogglePassword={() => setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
      />

      {loginState.error && <ErrorMessage message="Phone number or password is incorrect" />}

      <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="flex items-center">
          <button onClick={() => setLoginState(prev => ({ ...prev, rememberMe: !prev.rememberMe }))} className="text-primary">
            {loginState.rememberMe ? <Icons.Checked /> : <Icons.Unchecked />}
          </button>
          <span className="ml-2 text-[14px] sm:text-[16px] text-primary">Remember me</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-[14px] sm:text-[16px] text-primary hover:text-quaternary transition-colors duration-300 mt-2 sm:mt-0"
        >
          Forgot Password?
        </button>
      </div>

      <Button onClick={handleLogin} className="mt-8">{t('login')}</Button>

      <div className="flex items-center w-[400px] mt-8">
        <div className="h-[1px] w-[180px] bg-primary opacity-40" />
        <span className="mx-4 text-[24px] font-light text-primary">OR</span>
        <div className="h-[1px] w-[180px] bg-primary opacity-40" />
      </div>

      <div className="w-[400px] flex items-center justify-end mt-6">
        <span className="text-[20px] font-semibold text-primary mr-4">Don't have an account?</span>
        <Button onClick={() => setIsRegister(true)} variant="secondary">Register</Button>
      </div>
    </>
  ), [loginState, handleLogin])

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          navigate('/')
        }}
        data={{
          title: t('loginSuccessTitle'),
          content: t('loginSuccessContent'),
          onlyAcceptable: true
        }}
      />
      <div className="w-[95%] max-w-[1200px] h-[600px] mx-auto mt-8 flex flex-col lg:flex-row shadow-[4px_4px_16px_0_rgba(0,0,0,0.25)] rounded-2xl">
        {/* Welcome Section - Hidden on mobile */}
        <div className={`hidden lg:block w-[780px] h-full bg-gradient-to-br from-primary to-quaternary relative rounded-l-2xl ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className={`absolute top-[96px] ${isRTL ? 'right-[64px]' : 'left-[64px]'}`}>
            <h1 className="text-[48px] font-bold text-quinary-tint-800">
              {t('loginWelcomeTitle')}
            </h1>
            <p className="text-[24px] font-normal text-quinary-tint-800 mt-4 max-w-[600px]">
              {t('loginWelcomeDescription')}
            </p>
          </div>
        </div>

        <div className={`w-full lg:w-[520px] h-full bg-quinary-tint-800 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none flex flex-col items-center p-4 sm:p-8 ${isRTL ? 'order-1 lg:rounded-l-2xl lg:rounded-r-none' : 'order-2'}`}>
          {isRegister ? (
            otpState.step ? (
              <>
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
                        <Icons.Error />
                        <span className={`${isRTL ? 'mr-1' : 'ml-1'} text-[14px] sm:text-[16px] font-normal text-quaternary`}>{t('invalidOtpCode')}</span>
                      </div>
                    )}
                    {/* Timer */}
                    <div className="flex flex-col items-center mt-4 mb-2">
                      <div className="relative flex items-center justify-center">
                        <svg width="48" height="48" sm:width="56" sm:height="56" viewBox="0 0 56 56">
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
                      <button type="button" onClick={handleResendOtp} disabled={!otpState.resendActive} className={`mt-2 text-primary text-[14px] sm:text-[16px] font-semibold transition-opacity ${otpState.resendActive ? '' : 'opacity-40 cursor-not-allowed'}`}>{t('resendCode')}</button>
                    </div>
                    <button type="submit" className="w-[150px] h-[39px] mt-[32px] bg-gradient-to-br from-primary to-quaternary rounded-[45px] text-white text-[16px] font-semibold flex items-center justify-center transition-all duration-300 hover:from-quaternary hover:to-primary">{t('verify')}</button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[28px] sm:text-[36px] font-bold text-primary mt-[32px]">{t('userRegister')}</h2>
                <div className="w-full max-w-[400px] flex flex-col items-center">
                  {/* Phone Input */}
                  <Input
                    icon={Icons.User}
                    type="text"
                    placeholder={t('phoneNumber')}
                    value={registerState.phone}
                    onChange={e => dispatchRegister({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
                  />
                  {registerState.phoneError && <ErrorMessage message={t('invalidPhoneNumber')} />}

                  {/* Password Input */}
                  <Input
                    icon={Icons.Lock}
                    type={registerState.showPassword ? 'text' : 'password'}
                    placeholder={t('password')}
                    value={registerState.password}
                    onChange={e => dispatchRegister({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                    showPassword={registerState.showPassword}
                    onTogglePassword={() => dispatchRegister({ type: 'TOGGLE_PASSWORD' })}
                  />

                  {/* Confirm Password Input */}
                  <Input
                    icon={Icons.Lock}
                    type={registerState.showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('confirmPassword')}
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
                  <Button onClick={handleRegister} className="mt-[16px]">{t('register')}</Button>

                  {/* OR Separator */}
                  <div className="flex items-center w-full mt-[24px]">
                    <div className="h-[1px] flex-1 bg-primary opacity-40" />
                    <span className="mx-4 text-[20px] sm:text-[24px] font-light text-primary">{t('or')}</span>
                    <div className="h-[1px] flex-1 bg-primary opacity-40" />
                  </div>

                  {/* Login Row */}
                  <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-[16px]">
                    <span className="text-[16px] sm:text-[20px] font-semibold text-primary">{t('alreadyHaveAccount')}</span>
                    <Button onClick={() => setIsRegister(false)} variant="secondary">{t('login')}</Button>
                  </div>
                </div>
              </>
            )
          ) : (
            <>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-primary mt-[32px]">{t('userLogin')}</h2>
              <div className="w-full max-w-[400px] flex flex-col items-center">
                <Input
                  icon={Icons.User}
                  type="text"
                  placeholder={t('phoneNumber')}
                  value={loginState.phone}
                  onChange={e => setLoginState(prev => ({ ...prev, phone: e.target.value }))}
                />

                <Input
                  icon={Icons.Lock}
                  type={loginState.showPassword ? "text" : "password"}
                  placeholder={t('password')}
                  value={loginState.password}
                  onChange={e => setLoginState(prev => ({ ...prev, password: e.target.value }))}
                  showPassword={loginState.showPassword}
                  onTogglePassword={() => setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                />

                {loginState.error && <ErrorMessage message={t('invalidCredentials')} />}

                <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-4">
                  <div className="flex items-center">
                    <button onClick={() => setLoginState(prev => ({ ...prev, rememberMe: !prev.rememberMe }))} className="text-primary">
                      {loginState.rememberMe ? <Icons.Checked /> : <Icons.Unchecked />}
                    </button>
                    <span className="ml-2 text-[14px] sm:text-[16px] text-primary">{t('rememberMe')}</span>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-[14px] sm:text-[16px] text-primary hover:text-quaternary transition-colors duration-300 mt-2 sm:mt-0"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>

                <Button onClick={handleLogin} className="mt-8">{t('login')}</Button>

                {/* OR Separator */}
                <div className="flex items-center w-full mt-8">
                  <div className="h-[1px] flex-1 bg-primary opacity-40" />
                  <span className="mx-4 text-[20px] sm:text-[24px] font-light text-primary">{t('or')}</span>
                  <div className="h-[1px] flex-1 bg-primary opacity-40" />
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <span className="text-[16px] sm:text-[20px] font-semibold text-primary">{t('dontHaveAccount')}</span>
                  <Button onClick={() => setIsRegister(true)} variant="secondary">{t('register')}</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
