import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/blog/Header.jsx";
import Footer from "./components/blog/Footer.jsx";
import Divider from "./components/blog/Divider.jsx";
import ContactBoxes from "./components/blog/ContactBoxes.jsx";
import LogoSection from "./components/blog/LogoSection.jsx";
import './i18n';
import { loadNamespaces } from './i18n';
import { AuthProvider } from './context/AuthContext';
import { WebsiteRoutes } from './router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import useLanguageChange from './hooks/useLanguageChange';
import { SearchProvider } from './context/SearchContext';
import SpinLoader from './pages/UI/SpinLoader.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'fa';
  const isAdminPath = location.pathname.startsWith('/admin');

  useLanguageChange();

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      {!isAdminPath && (
        <>
          <Header />
          <Suspense fallback={<SpinLoader />}>
            <WebsiteRoutes />
          </Suspense>
          <Divider />
          <ContactBoxes />
          <Divider />
          <Footer />
          <LogoSection />
        </>
      )}

      {isAdminPath && (
        <Suspense fallback={<SpinLoader />}>
          <WebsiteRoutes />
        </Suspense>
      )}
    </div>
  );
}

// ✅ InnerApp for accessing location AFTER Router
function InnerApp() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'fa';
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    // فقط اگه تو مسیر ادمین نیست، dir رو بر اساس زبان تنظیم کن
    if (!isAdminPath) {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    } else {
      document.documentElement.dir = 'rtl'; // همیشه rtl برای ادمین
    }

    document.documentElement.lang = i18n.language;
    loadNamespaces('blog');
  }, [i18n.language, location.pathname]);

  return (
    <>
      <ToastContainer rtl={isRTL} />
      <ScrollToTop />
      <AppContent />
    </>
  );
}

function App() {
  return (
    <SearchProvider>
      <Router>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </Router>
    </SearchProvider>
  );
}

export default App;
