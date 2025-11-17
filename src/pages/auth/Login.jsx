import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'
import { loadNamespaces } from '../../i18n.js'
import { authIcons } from '../../data/Icons.jsx'
import Input from '../../components/authentication/common/Input.jsx'
import Button from '../../components/authentication/common/Button.jsx'
import ErrorMessage from '../../components/authentication/common/ErrorMessage.jsx'
import { successNotif, errorNotif } from '../../utils/customNotifs.jsx'

export default function Login() {
  const { t, i18n } = useTranslation(['blog', 'validation']);
  const isRTL = i18n.language === 'fa';
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);


  // Form data state
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  });

  // Error State - now stores the translation key
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load validation translations when component mounts
  useEffect(() => {
    loadNamespaces('validation');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated])

  // Check if form data has changed from initial state
  const isDataEmpty = () => !formData.phone || !formData.password;

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error before login attempt
    setLoading(true);
    
    try {
      // Call the login function from AuthContext
      const result = await login(formData.phone, formData.password);
      console.log(result);

      if (!result.success) {
        // Show error notification
        setError(result.error[0]);
        setLoading(false);
      } else {  
        // Show success notification
        successNotif(t('loginSuccessTitle', { ns: 'validation' }));
        // The navigate is handled within the login function in AuthContext
        setLoading(false);
      }
    } catch (err) {
       console.error('Login error:', err.message);
       setLoading(false);
    }
  };


  return (
    <>
      <div className="w-[95%] max-w-[1200px] h-[600px] mx-auto mt-8 flex flex-col lg:flex-row shadow-[4px_4px_16px_0_rgba(0,0,0,0.25)] rounded-2xl">
        {/* Welcome Section - Hidden on mobile */}
        <div className={`hidden lg:block w-[780px] h-full bg-gradient-to-br from-primary to-quaternary relative rounded-l-2xl ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className={`relative top-[96px] max-w-[88%] ${isRTL ? 'right-[64px]' : 'left-[64px]'}`}>
            <h1 className="text-[48px] font-bold text-quinary-tint-800">
              {t('loginWelcomeTitle', { ns: 'validation' })}
            </h1>
            <p className="text-[24px] font-normal  text-quinary-tint-800 mt-4 max-w-[90%] text-justify">
              {t('loginWelcomeDescription', { ns: 'validation' })}
            </p>
          </div>
        </div>

        <div className={`w-full lg:w-[550px] h-full bg-quinary-tint-800 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none flex flex-col items-center p-4 sm:p-8 ${isRTL ? 'order-1 lg:rounded-l-2xl lg:rounded-r-none' : 'order-2'}`}>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-primary mt-[32px]">{t('userLogin', { ns: 'validation' })}</h2>
          <form onSubmit={handleLogin} className="w-full max-w-[400px] flex flex-col items-center">
            <Input
              icon={authIcons.User}
              type="text"
              placeholder={t('phoneNumber', { ns: 'validation' })}
              value={formData.phone}
              onChange={e => {
                const rawValue = e.target.value;
                const numbersOnly = rawValue.replace(/\D/g, ''); // Remove all non-digit characters

                if (numbersOnly.length <= 11) {
                  setFormData(prev => ({ ...prev, phone: numbersOnly }));
                } 
              }}
              required
            />

            <Input
              icon={authIcons.Lock}
              type={showPassword ? "text" : "password"}
              placeholder={t('password', { ns: 'validation' })}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              showPassword={showPassword}
              required={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {error && <ErrorMessage errorMessage={error} />}

            <div className="w-[90%] flex flex-wrap flex-row justify-between items-center mt-4">
              <div className="flex items-center">
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))} 
                  className="text-primary"
                >
                  {formData.rememberMe ? <authIcons.Checked /> : <authIcons.Unchecked />}
                </button>
                <span className="ml-2 text-[14px] sm:text-[16px] text-primary">{t('rememberMe', { ns: 'validation' })}</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[14px] sm:text-[16px] text-primary hover:text-quaternary transition-colors duration-300 sm:mt-0"
              >
                {t('forgotPassword', { ns: 'validation' })}
              </button>
            </div>

            <Button 
              type="submit"
              className="mt-4 cursor-pointer" 
              disabled={isDataEmpty() || loading}
              loading={loading}
              variant="primary"
            >
              {t('login', { ns: 'validation' })}
            </Button>

            {/* OR Separator */}
            <div className="flex items-center w-full mt-8">
              <div className="h-[1px] flex-1 bg-primary opacity-40" />
              <span className="mx-4 text-[20px] sm:text-[24px] font-light text-primary">{t('or', { ns: 'validation' })}</span>
              <div className="h-[1px] flex-1 bg-primary opacity-40" />
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <span className="text-[16px] sm:text-[20px] font-semibold text-primary">{t('dontHaveAccount', { ns: 'validation' })}</span>
              <Button 
                type="button"
                onClick={() => navigate('/register')} 
                variant="secondary"
              >
                {t('register', { ns: 'validation' })}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
