import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import SpinLoader from '../pages/UI/SpinLoader';
import PageNotFound from '../pages/UI/PageNotFound';
import { AdminIcons } from '../data/Icons';
import AdminSomethingWentWrong from '../pages/AdminUI/AdminSomethingWentWrong';
import AccessDenied from '../pages/UI/AccessDenied';
import AdminAccessDenied from '../pages/AdminUI/AdminAccessDenied'

const AdminLayout = () => {
  const { isAdminPannelAccess, logout, user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hasRouteAccess, setHasRouteAccess] = useState(true);

  // بررسی دسترسی کاربر به مسیر فعلی
  useEffect(() => {
    if (user) {
      const currentPath = location.pathname;
      
      // تعریف قوانین دسترسی برای هر مسیر
      if (currentPath.includes('/admin/users')) {
        // Users route: only superuser can access
        setHasRouteAccess(user.is_superuser === true);
      } 
      else if (currentPath.includes('/admin/news') || currentPath.includes('/admin/news/edit')) {
        // News route: superuser OR author can access
        setHasRouteAccess(user.is_superuser === true || user.is_author === true);
      }
      else if (currentPath.includes('/admin/shop')) {
        // Shop route: superuser OR seller can access
        setHasRouteAccess(user.is_superuser === true || user.is_seller === true);
      }
      else if (currentPath.includes('/admin/players')) {
        // Players route: superuser OR author can access
        setHasRouteAccess(user.is_superuser === true || user.is_author === true);
      }
      else if (currentPath === '/admin' || currentPath === '/admin/') {
        // Dashboard route: anyone with admin panel access can access
        setHasRouteAccess(true);
      }
      else {
        // Default: allow access
        setHasRouteAccess(true);
      }
    }
  }, [location.pathname, user]); // Depend on user instead of userData

  // تعیین تب‌ها بر اساس سطح دسترسی
  const getTabs = () => {
    if (!user) return [];
    
    const tabs = [];
    
    // Dashboard is accessible to anyone with admin panel access
    tabs.push({ id: 'dashboard', label: 'داشبورد', icon: AdminIcons.Dashboard, path: '/admin' });
    
    // Users tab - only for superusers
    if (user.is_superuser === true) {
      tabs.push({ id: 'users', label: 'کاربران', icon: AdminIcons.Users, path: '/admin/users' });
    }
    
    // News tab - for superusers OR authors
    if (user.is_superuser === true || user.is_author === true) {
      tabs.push({ id: 'news', label: 'اخبار', icon: AdminIcons.News, path: '/admin/news' });
    }
    
    // Shop tab - for superusers OR sellers
    if (user.is_superuser === true || user.is_seller === true) {
      tabs.push({ id: 'shop', label: 'فروشگاه', icon: AdminIcons.Shop, path: '/admin/shop' });
    }
    
    // Players tab - for superusers OR authors
    if (user.is_superuser === true || user.is_author === true) {
      tabs.push({ id: 'players', label: 'بازیکن‌ها', icon: AdminIcons.Teams, path: '/admin/players' });
    }
    // Teams tab - for superusers OR authors
    if (user.is_superuser === true || user.is_author === true) {
      tabs.push({ id: 'teams', label: 'تیم‌ها', icon: AdminIcons.Teams, path: '/admin/teams' });
    }
    
    return tabs;
  };

  const tabs = getTabs();

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => {
      if (tab.path === '/admin') {
        return currentPath === '/admin' || currentPath === '/admin/';
      }
      return currentPath.startsWith(tab.path);
    });
    return activeTab ? activeTab.id : tabs[0]?.id || 'dashboard';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  
  if (isAdminPannelAccess === null) { // Change userLoading to user === null
    return <SpinLoader />;
  }

  if (isAdminPannelAccess?.isError) {
    <AdminSomethingWentWrong />
  }

  if (!isAdminPannelAccess) {
    return <PageNotFound />;
  }

  if (isAdminPannelAccess && !hasRouteAccess) {
    return <AdminAccessDenied />
  }


  return (
    <div className="flex h-screen bg-quinary-tint-600">
      {/* Sidebar */}
      <div className="w-80 bg-quinary-tint-800 shadow-[0_0_16px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-quinary-tint-700">
          <h2 className="text-2xl font-bold text-primary">پنل مدیریت</h2>
          <p className="text-secondary text-sm mt-1">مدیریت محتوا و کاربران</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-grow px-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium transition-colors duration-200 ${
                  getActiveTab() === tab.id
                    ? 'bg-primary text-quinary-tint-800'
                    : 'text-secondary hover:bg-quinary-tint-700'
                }`}
              >
                {tab.icon ? <tab.icon /> : <AdminIcons.Dashboard />}
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-quinary-tint-700">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="p-2 bg-primary bg-opacity-20 rounded-full">
              <AdminIcons.User />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-secondary">خوش آمدید،</p>
              <p className="text-lg font-semibold text-primary">
                {(user?.first_name && user?.last_name) 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.phone_number}
              </p>
              <div className="flex gap-2 mt-2">
                {user?.is_superuser && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    ادمین
                  </span>
                )}
                {user?.is_author && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    نویسنده
                  </span>
                )}
                {user?.is_seller && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    فروشنده
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-secondary hover:text-quaternary transition-colors duration-200"
            >
              <AdminIcons.Logout />
            </button>
          </div>
          
          {/* Return to Website Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full py-2 px-4 bg-gradient-to-l from-primary to-primary-tint-200 text-quinary-tint-800 rounded-lg shadow-md hover:from-primary-tint-200 hover:to-primary transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
            بازگشت به سایت
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut" 
              }}
            >
              {hasRouteAccess ? <Outlet /> : <AccessDenied />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-quinary-tint-800 p-6 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-primary mb-4">تأیید خروج</h3>
            <p className="text-secondary mb-6">آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg hover:bg-quinary-tint-600 transition-colors duration-200"
              >
                انصراف
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-200 font-medium"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;