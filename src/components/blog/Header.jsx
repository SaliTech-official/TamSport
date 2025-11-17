import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next';
import { loadNamespaces } from '../../i18n.js';
import { useSearch } from '../../context/SearchContext.jsx';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['blog']);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const searchBarRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const isRTL = i18n.language === 'fa';
  const searchInputRef = useRef(null);
  const { updateSearchQuery } = useSearch();

  // Load the blog namespace for translations
  useEffect(() => {
    loadNamespaces('blog');
  }, []);

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
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLanguageChange = (lang) => {
    if (lang != localStorage.getItem("language")) {
      // First set the language in localStorage
      localStorage.setItem('language', lang);
      
      // Then dispatch the event which will trigger the page reload
      window.dispatchEvent(new Event('languageChange'));
      
      // Close the language selector
    }
    setIsLangOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('home', { ns: 'blog' }) },
    { to: '/news', label: t('news', { ns: 'blog' }) },
    { to: '/shop', label: t('shop', { ns: 'blog' }) },
    { to: '#contact', label: t('contact', { ns: 'blog' }), onClick: scrollToContact },
    { to: '/about', label: t('about', { ns: 'blog' }) }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchContent.trim()) {
      updateSearchQuery(searchContent);
      navigate(`/news?search=${encodeURIComponent(searchContent.trim())}`);
      setIsSearchOpen(false);
      setSearchContent('');
      window.location.reload()
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

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
            {/* Only show on desktop */}
            <div className="hidden lg:flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              {/* Search Box */}
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`focus:outline-none transition-all duration-300 ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-tertiary transition-colors duration-300">
                    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                      <path
                        d="M27 27L19.4935 19.4935M19.4935 19.4935C21.5252 17.4619 22.6665 14.7064 22.6665 11.8333C22.6665 8.96011 21.5252 6.20462 19.4935 4.17299C17.4619 2.14136 14.7064 1 11.8333 1C8.96011 1 6.20462 2.14136 4.17299 4.17299C2.14136 6.20462 1 8.96011 1 11.8333C1 14.7064 2.14136 17.4619 4.17299 19.4935C6.20462 21.5252 8.96011 22.6665 11.8333 22.6665C14.7064 22.6665 17.4619 21.5252 19.4935 19.4935Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                </button>
                <div 
                  ref={searchBarRef}
                  className={`absolute ${isRTL ? 'left-[-16px]' : 'right-[-16px]'} top-1/2 -translate-y-1/2 h-8 sm:h-9 md:h-10 w-[140px] sm:w-[180px] md:w-[220px] bg-quinary-tint-600 rounded-lg flex items-center transition-all duration-300 ease-out ${
                    isSearchOpen 
                      ? 'translate-x-0 opacity-100' 
                      : isRTL ? 'translate-x-[-8px] opacity-0 pointer-events-none' : 'translate-x-8 opacity-0 pointer-events-none'
                  }`}
                >
                  <form  className="flex items-center h-full w-full">
                    <div className="flex items-center h-full">
                      <img 
                        src="/images/icons/SearchLogoBlack.svg" 
                        alt="Search" 
                        className={`${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'} h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5`}
                        onClick={handleSearch}
                      />
                      <div className={`h-4 sm:h-5 md:h-6 border-l-[1px] border-secondary ${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'}`}></div>
                    </div>
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder={t('search', { ns: 'blog' })}
                      className="w-[80px] sm:w-[100px] md:w-[120px] h-full pl-3 sm:pl-4 pr-2 sm:pr-3 bg-transparent outline-none text-secondary placeholder-secondary/50 text-xs sm:text-sm md:text-base"
                      value={searchContent}
                      onChange={(e) => setSearchContent(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </form>
                </div>
              </div>
              <div className="h-8 sm:h-10 md:h-12 w-px bg-[#F2FAFF] opacity-30"></div>
              {/* Account Button */}
              <button onClick={handleAccountClick} className="flex items-center group h-8 sm:h-10 md:h-12 focus:outline-none">
                  {isAuthenticated ? (
                    // UserLogo2 (fill)
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-tertiary transition-colors duration-300">
                      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.2506 9C11.2506 7.20979 11.9618 5.4929 13.2277 4.22703C14.4935 2.96116 16.2104 2.25 18.0006 2.25C19.7908 2.25 21.5077 2.96116 22.7736 4.22703C24.0395 5.4929 24.7506 7.20979 24.7506 9C24.7506 10.7902 24.0395 12.5071 22.7736 13.773C21.5077 15.0388 19.7908 15.75 18.0006 15.75C16.2104 15.75 14.4935 15.0388 13.2277 13.773C11.9618 12.5071 11.2506 10.7902 11.2506 9ZM5.62713 30.1575C5.67771 26.9092 7.00359 23.8111 9.31857 21.5319C11.6336 19.2527 14.7519 17.9752 18.0006 17.9752C21.2493 17.9752 24.3677 19.2527 26.6827 21.5319C28.9977 23.8111 30.3236 26.9092 30.3741 30.1575C30.378 30.3762 30.3181 30.5913 30.2017 30.7764C30.0853 30.9616 29.9174 31.1088 29.7186 31.2C26.0424 32.8856 22.0449 33.7555 18.0006 33.75C13.8216 33.75 9.85113 32.838 6.28263 31.2C6.08386 31.1088 5.916 30.9616 5.79958 30.7764C5.68316 30.5913 5.62323 30.3762 5.62713 30.1575Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    
                  ) : (
                    // UserLogo (stroke)
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-tertiary transition-colors duration-300">
                      <svg viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <path
                          d="M18.2508 6.76923C18.2508 8.29932 17.6449 9.76674 16.5664 10.8487C15.4879 11.9306 14.0252 12.5385 12.5 12.5385C10.9748 12.5385 9.51207 11.9306 8.43359 10.8487C7.35512 9.76674 6.74923 8.29932 6.74923 6.76923C6.74923 5.23913 7.35512 3.77171 8.43359 2.68977C9.51207 1.60783 10.9748 1 12.5 1C14.0252 1 15.4879 1.60783 16.5664 2.68977C17.6449 3.77171 18.2508 5.23913 18.2508 6.76923ZM1 28.4892C1.04928 25.4621 2.28256 22.5756 4.43386 20.4524C6.58517 18.3291 9.48213 17.1392 12.5 17.1392C15.5179 17.1392 18.4148 18.3291 20.5661 20.4524C22.7174 22.5756 23.9507 25.4621 24 28.4892C20.3922 30.1488 16.469 31.0054 12.5 31C8.39625 31 4.50107 30.1015 1 28.4892Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
              </button>

              <div className="h-8 sm:h-10 md:h-12 w-px bg-[#F2FAFF] opacity-50"></div>
              {/* Pre Register Button */}
              <button
                onClick={() => navigate('/pre-register')}
                className={`hidden lg:inline-flex items-center px-4 py-2 rounded-lg border-2 border-quinary-tint-800 text-quinary-tint-800 font-semibold text-sm md:text-base shadow hover:border-tertiary hover:text-tertiary transition-all duration-300 ease-in-out ${isRTL ? 'mr-2' : 'ml-2'}`}
                style={{ minHeight: '40px' }}
              >
                {i18n.language === 'fa' ? 'پیش ثبت نام' : 'Pre Register'}
              </button>
              <div className="h-8 sm:h-10 md:h-12 w-px bg-[#F2FAFF] opacity-50"></div>
            </div>
            {/* Language Selector (always visible) */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="focus:outline-none"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-quinary-tint-800 hover:text-tertiary transition-colors duration-300">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 31C19.325 30.9998 22.5558 29.8953 25.1851 27.86C27.8143 25.8247 29.6932 22.9738 30.5267 19.755M16 31C12.675 30.9998 9.44424 29.8953 6.81496 27.86C4.18568 25.8247 2.3068 22.9738 1.47334 19.755M16 31C20.1417 31 23.5 24.2833 23.5 16C23.5 7.71667 20.1417 1 16 1M16 31C11.8583 31 8.50001 24.2833 8.50001 16C8.50001 7.71667 11.8583 1 16 1M30.5267 19.755C30.835 18.555 31 17.2967 31 16C31.0041 13.4202 30.3398 10.8833 29.0717 8.63667M30.5267 19.755C26.082 22.219 21.082 23.508 16 23.5C10.73 23.5 5.77834 22.1417 1.47334 19.755M1.47334 19.755C1.15792 18.5283 0.998879 17.2666 1.00001 16C1.00001 13.325 1.70001 10.8117 2.92834 8.63667M16 1C18.6604 0.998891 21.2732 1.7056 23.5703 3.04761C25.8674 4.38962 27.7662 6.31861 29.0717 8.63667M16 1C13.3396 0.998891 10.7268 1.7056 8.42969 3.04761C6.13257 4.38962 4.23385 6.31861 2.92834 8.63667M29.0717 8.63667C25.4428 11.7799 20.8009 13.5069 16 13.5C11.0033 13.5 6.43334 11.6667 2.92834 8.63667"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

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
                    {t('selectLanguage', { ns: 'blog' })}
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
                      {t('persian', { ns: 'blog' })}
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
                      {t('english', { ns: 'blog' })}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Side Drawer) */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-screen w-1/3 min-w-[220px] max-w-xs z-50 transition-transform duration-500 ease-in-out bg-[rgba(var(--color-primary-rgb),0.98)] shadow-2xl border-t-0 border-b-0 border-${isRTL ? 'r' : 'l'} border-white/20 rounded-${isRTL ? 'l' : 'r'}-2xl
            ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
          `}
          style={{direction: isRTL ? 'rtl' : 'ltr'}}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-end items-center p-4 border-b border-white/10">
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="text-quinary-tint-800 hover:text-tertiary transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
                        className={`w-full font-inter text-[16px] text-quinary-tint-800 hover:text-tertiary transition-all duration-300 ${
                          isRTL ? 'text-right' : 'text-left'
                        } px-2 py-1.5`}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link 
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block w-full font-inter text-[16px] text-quinary-tint-800 hover:text-tertiary transition-all duration-300 ${
                          location.pathname === link.to ? 'text-tertiary' : ''
                        } ${isRTL ? 'text-right' : 'text-left'} px-2 py-1.5`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              {/* Search box inside drawer (redesigned) */}
              <form onSubmit={handleSearch} className={`flex items-center bg-quinary-tint-600 rounded-lg mx-4 mt-4 px-2 py-1.5 border border-quinary-tint-400 focus-within:border-tertiary transition-all duration-200`}>
                <button type="submit" className={`flex items-center justify-center p-0 m-0 focus:outline-none`}
                  style={{lineHeight: 0}}>
                  <img 
                    src="/images/icons/SearchLogoBlack.svg" 
                    alt="Search" 
                    className="h-5 w-5"
                  />
                </button>
                <input 
                  type="text" 
                  placeholder={t('search', { ns: 'blog' })}
                  className={`flex-1 bg-transparent outline-none text-secondary placeholder-secondary/50 text-base ${isRTL ? 'text-right pr-2' : 'text-left pl-2'}`}
                  value={searchContent}
                  onChange={(e) => setSearchContent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{minWidth: 0}}
                />
              </form>
              {/* Login/Register button right below search box */}
              <div className="mx-4 mt-3 mb-4">
                <button
                  onClick={handleAccountClick}
                  className="w-full py-2 rounded-lg bg-secondary text-white font-semibold text-base shadow hover:bg-secondary-tint-100 transition-colors duration-200 focus:outline-none"
                  style={{minHeight: '40px'}}
                >
                  {isAuthenticated ? t('hamburgerProfile', { ns: 'blog' }) : t('hamburgerLoginRegister', { ns: 'blog' })}
                </button>
                <button
                  onClick={() => {
                    navigate('/pre-register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 py-2 rounded-lg border-2 border-quinary-tint-800 text-quinary-tint-800 font-semibold text-base shadow hover:border-tertiary hover:text-tertiary transition-all duration-300 ease-in-out focus:outline-none"
                  style={{minHeight: '40px'}}
                >
                  {i18n.language === 'fa' ? 'پیش ثبت نام' : 'Pre Register'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
