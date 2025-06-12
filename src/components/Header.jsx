import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const searchBarRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user } = useAuth();
  const isRTL = i18n.language === 'fa';

  // Set document direction on mount and language change
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the menu and the toggle button
      const isClickInsideMenu = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      const isClickOnToggleButton = event.target.closest('button[aria-label="Toggle mobile menu"]');
      
      if (isMobileMenuOpen && !isClickInsideMenu && !isClickOnToggleButton) {
        setIsMobileMenuOpen(false);
      }
      
      if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (isLangOpen && langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isLangOpen, isMobileMenuOpen]);

  // Account button click handler
  const handleAccountClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    setIsLangOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/news', label: t('news') },
    { to: '/shop', label: t('shop') },
    { to: '#contact', label: t('contact'), onClick: scrollToContact },
    { to: '/about', label: t('about') }
  ];

  return (
    <div className="sticky top-2 z-50">
      <div className="w-full max-w-[1300px] h-16 sm:h-20 md:h-24 bg-primary mx-auto mt-4 rounded-2xl shadow-[0_0_16px_rgba(1,22,56,0.5)] relative z-10 px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-full relative">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-quinary-tint-800 hover:text-tertiary transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-6 ml-8">
            {navLinks.map((link) => (
              link.to === '#contact' ? (
                <button 
                  key={link.label}
                  onClick={link.onClick}
                  className={`font-inter text-[16px] xl:text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group`}
                >
                  {link.label}
                  <span className={`absolute -bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-0 h-0.5 transition-all duration-300 ease-in-out group-hover:w-full bg-tertiary`}></span>
                </button>
              ) : (
                <Link 
                  key={link.label}
                  to={link.to} 
                  className={`font-inter text-[16px] xl:text-[20px] leading-6 text-quinary-tint-800 no-underline hover:text-tertiary transition-all duration-300 ease-in-out relative group ${
                    location.pathname === link.to ? 'text-tertiary' : ''
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-0 h-0.5 transition-all duration-300 ease-in-out ${
                    location.pathname === link.to ? 'w-full bg-tertiary' : 'group-hover:w-full bg-tertiary'
                  }`}></span>
                </Link>
              )
            ))}
          </nav>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src="/images/logos/HeaderLogo.svg" alt="Logo" className="h-12 sm:h-16 md:h-[95px] w-auto object-contain" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            {/* Search Box */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`focus:outline-none transition-all duration-300 ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}
              >
                <img 
                  src="/images/icons/SearchLogo.svg" 
                  alt="Search" 
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-secondary transition-colors duration-300"
                />
              </button>
              <div 
                ref={searchBarRef}
                className={`absolute ${isRTL ? 'left-[-16px]' : 'right-[-16px]'} top-1/2 -translate-y-1/2 h-8 sm:h-9 md:h-10 w-[140px] sm:w-[180px] md:w-[220px] bg-quinary-tint-600 rounded-lg flex items-center transition-all duration-300 ease-out ${
                  isSearchOpen 
                    ? 'translate-x-0 opacity-100' 
                    : isRTL ? 'translate-x-[-8px] opacity-0 pointer-events-none' : 'translate-x-8 opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center h-full">
                  <img 
                    src="/images/icons/SearchLogoBlack.svg" 
                    alt="Search" 
                    className={`${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'} h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5`}
                  />
                  <div className={`h-4 sm:h-5 md:h-6 border-l-[1px] border-secondary ${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'}`}></div>
                </div>
                <input 
                  type="text" 
                  placeholder={t('search')}
                  className="w-[80px] sm:w-[100px] md:w-[120px] h-full pl-3 sm:pl-4 pr-2 sm:pr-3 bg-transparent outline-none text-secondary placeholder-secondary/50 text-xs sm:text-sm md:text-base"
                  value={searchContent}
                  onChange={(e) => setSearchContent(e.target.value)}
                />
              </div>
            </div>

            <div className="h-8 sm:h-10 md:h-12 w-px bg-[#F2FAFF] opacity-50"></div>

            {/* Account Button */}
            <button onClick={handleAccountClick} className="flex items-center group h-8 sm:h-10 md:h-12 focus:outline-none">
              {user ? (
                <>
                  <span className="text-quinary-tint-800 text-[14px] sm:text-[16px] md:text-[20px] font-normal mr-1">{user.phone}</span>
                  <img src="/images/icons/UserLogo2.svg" alt="User" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-colors duration-200 group-hover:text-quinary-tint-600 text-quinary-tint-800" />
                </>
              ) : (
                <img src="/images/icons/UserLogo.svg" alt="User" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-colors duration-200 group-hover:text-quinary-tint-600 text-quinary-tint-800" />
              )}
            </button>

            <div className="h-8 sm:h-10 md:h-12 w-px bg-[#F2FAFF] opacity-50"></div>

            {/* Language Selector */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="focus:outline-none"
              >
                <img 
                  src="/images/icons/LangLogo.svg" 
                  alt="lang" 
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-secondary transition-colors duration-300"
                />
              </button>
              <div 
                ref={langRef}
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-[124px] sm:h-[134px] md:h-[144px] w-[180px] sm:w-[200px] md:w-[220px] bg-quinary-tint-600 rounded-lg transition-all duration-300 ease-out ${
                  isLangOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center pt-2 pb-2 sm:pt-2.5 sm:pb-2.5 pl-2 pr-2 sm:pl-3 sm:pr-3">
                  <img 
                    src="/images/icons/LangLogoBlack.svg" 
                    alt="Language" 
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                  />
                  <span className={`${isRTL ? 'mr-1.5' : 'ml-1.5'} text-xs sm:text-sm md:text-base leading-[18px] sm:leading-[20px] md:leading-[24px] text-secondary font-inter`}>
                    {t('selectLanguage')}
                  </span>
                </div>
                <div className="h-px w-[calc(100%-16px)] sm:w-[calc(100%-24px)] bg-secondary/50 mx-2 sm:mx-3"></div>
                <div className="flex flex-col space-y-2 sm:space-y-2.5 p-2 sm:p-2.5">
                  <button 
                    onClick={() => handleLanguageChange('fa')}
                    className="flex items-center hover:bg-quaternary-tint-200 rounded-lg p-1.5"
                  >
                    <img 
                      src="/images/icons/IranFlag.svg" 
                      alt="فارسی" 
                      className="w-6 h-3.5 sm:w-7 sm:h-4 md:w-8 md:h-5"
                    />
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-secondary font-inter text-xs sm:text-sm md:text-base`}>
                      {t('persian')}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('en')}
                    className="flex items-center hover:bg-quaternary-tint-200 rounded-lg p-1.5"
                  >
                    <img 
                      src="/images/icons/UKFlag.svg" 
                      alt="English" 
                      className="w-6 h-3.5 sm:w-7 sm:h-4 md:w-8 md:h-5"
                    />
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-secondary font-inter text-xs sm:text-sm md:text-base`}>
                      {t('english')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 mt-2 rounded-lg transition-all duration-500 ease-in-out transform origin-top backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(var(--color-primary-rgb),0.4),0_0_20px_rgba(var(--color-tertiary-rgb),0.2)] bg-[rgba(var(--color-primary-rgb),0.8)] ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0 scale-y-100' 
              : 'opacity-0 -translate-y-4 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="relative overflow-hidden">
            {/* Decorative top border with glass effect */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--color-tertiary-rgb),0.5)] to-transparent"
            ></div>
            
            <nav className="flex flex-col p-4 space-y-3">
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className={`transform transition-all duration-500 ease-out ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {link.to === '#contact' ? (
                    <button 
                      onClick={() => {
                        link.onClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full font-inter text-[16px] text-quinary-tint-800 hover:text-tertiary hover:text-shadow-[0_0_8px_rgba(var(--color-tertiary-rgb),0.3)] transition-all duration-300 ${
                        isRTL ? 'text-right' : 'text-left'
                      } px-2 py-1.5`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link 
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full font-inter text-[16px] text-quinary-tint-800 hover:text-tertiary hover:text-shadow-[0_0_8px_rgba(var(--color-tertiary-rgb),0.3)] transition-all duration-300 ${
                        location.pathname === link.to ? 'text-tertiary' : ''
                      } ${isRTL ? 'text-right' : 'text-left'} px-2 py-1.5`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Decorative bottom border with glass effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--color-tertiary-rgb),0.5)] to-transparent"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
