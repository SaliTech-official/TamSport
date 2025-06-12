import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { newsData } from '../data/newsData';
import { 
  getAccessibleTabs, 
  canAccessTab, 
  canEditUser, 
  canManageRoles,
  getUserRole,
  ROLES 
} from '../utils/roles';

// Icons
const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  News: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
  ),
  Shop: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  ),
  Toggle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h9Z" />
    </svg>
  )
};

const Admin = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStatuses, setUserStatuses] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get accessible tabs for current user
  const accessibleTabs = getAccessibleTabs(user);
  
  // Set initial active tab to first accessible tab
  React.useEffect(() => {
    if (accessibleTabs.length > 0 && !accessibleTabs.includes(activeTab)) {
      setActiveTab(accessibleTabs[0]);
    }
  }, [accessibleTabs, activeTab]);

  const allTabs = [
    { id: 'dashboard', label: t('adminDashboard'), icon: Icons.Dashboard },
    { id: 'users', label: t('adminUsers'), icon: Icons.Users },
    { id: 'news', label: t('adminNews'), icon: Icons.News },
    { id: 'shop', label: t('adminShop'), icon: Icons.Shop },
    { id: 'settings', label: t('adminSettings'), icon: Icons.Settings },
  ];

  // Filter tabs based on user permissions
  const tabs = allTabs.filter(tab => canAccessTab(user, tab.id));

  // Calculate statistics
  const stats = {
    totalUsers: fakeUsers.length,
    totalNews: newsData.length,
    totalProducts: 0, // We'll implement this later
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/admin/user/add');
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/user/edit/${userId}`);
  };

  const handleAddArticle = () => {
    navigate('/admin/article/add');
  };

  const handleEditArticle = (articleId) => {
    navigate(`/admin/article/edit/${articleId}`);
  };

  const handleToggleUserStatus = (userId) => {
    // Update local state for immediate UI feedback
    const newStatus = !getUserStatus(userId);
    setUserStatuses(prev => ({
      ...prev,
      [userId]: newStatus
    }));
    
    // Get user name for better message
    const userName = fakeUsers.find(u => u.id === userId)?.first_name || 'User';
    
    // Show success message
    setMessage({
      type: 'success',
      text: `User status changed to ${newStatus ? t('adminActive') : t('adminInactive')}`
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    
    // Here you would typically make an API call to update the user status
    console.log(`Toggling user ${userId} status to ${newStatus}`);
  };

  // Get current user status (local state or original data)
  const getUserStatus = (userId) => {
    return userStatuses.hasOwnProperty(userId) 
      ? userStatuses[userId] 
      : fakeUsers.find(u => u.id === userId)?.is_active || false;
  };

  if (!user || (getUserRole(user) !== ROLES.SUPER_ADMIN && 
                getUserRole(user) !== ROLES.ADMIN && 
                getUserRole(user) !== ROLES.AUTHOR && 
                getUserRole(user) !== ROLES.SELLER)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-quinary-tint-800 text-2xl font-bold">
                    {user?.phone?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-tertiary rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className={`ml-4 ${isRTL ? 'text-right mr-4' : 'text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">{t('adminWelcome')}</h1>
                <p className="text-[16px] sm:text-[18px] text-secondary">{user?.phone}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-6 py-2 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-300 flex items-center gap-2"
            >
              <Icons.Logout />
              {t('adminLogout')}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-quinary-tint-800'
                        : 'text-secondary hover:bg-quinary-tint-700'
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h2 className={`text-[24px] font-bold text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('adminDashboardOverview')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalUsers')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalNews')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalNews}</p>
                      </div>
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalProducts')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminUsersManagement')}
                      </h2>
                      {canManageRoles(user) && (
                        <button 
                          onClick={handleAddUser}
                          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          {t('adminAddUser')}
                        </button>
                      )}
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-primary text-quinary-tint-800">
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminStatus')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminPhoneNumber')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminFirstName')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminLastName')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminRole')}</th>
                              <th className={`px-6 py-3`}></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-quinary-tint-500">
                            {fakeUsers.map((userItem, index) => {
                              const userRole = getUserRole(userItem);
                              const canEdit = canEditUser(user, userItem);
                              const canToggleStatus = canManageRoles(user);
                              
                              return (
                                <tr key={index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {canToggleStatus ? (
                                      <button
                                        onClick={() => handleToggleUserStatus(userItem.id)}
                                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                          getUserStatus(userItem.id)
                                            ? 'bg-emerald-400 border-emerald-500 hover:bg-emerald-500 shadow-sm'
                                            : 'bg-rose-400 border-rose-500 hover:bg-rose-500 shadow-sm'
                                        }`}
                                        title={`${getUserStatus(userItem.id) ? t('adminActive') : t('adminInactive')} - ${t('adminClickToToggle')}`}
                                      />
                                    ) : (
                                      <div className={`w-4 h-4 rounded-full border-2 ${
                                        getUserStatus(userItem.id)
                                          ? 'bg-emerald-400 border-emerald-500'
                                          : 'bg-rose-400 border-rose-500'
                                      }`} />
                                    )}
                                  </td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.phone}</td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.first_name}</td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.last_name}</td>
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                                      userRole === ROLES.SUPER_ADMIN ? 'bg-red-100 text-red-800' :
                                      userRole === ROLES.ADMIN ? 'bg-blue-100 text-blue-800' :
                                      userRole === ROLES.AUTHOR ? 'bg-green-100 text-green-800' :
                                      userRole === ROLES.SELLER ? 'bg-yellow-100 text-yellow-800' :
                                      userRole === ROLES.USER ? 'bg-gray-100 text-gray-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {userRole === ROLES.SUPER_ADMIN ? t('roleSuperAdmin') :
                                       userRole === ROLES.ADMIN ? t('roleAdmin') :
                                       userRole === ROLES.AUTHOR ? t('roleAuthor') :
                                       userRole === ROLES.SELLER ? t('roleSeller') :
                                       userRole === ROLES.USER ? t('roleUser') :
                                       t('roleUser')}
                                    </span>
                                  </td>
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="flex gap-2 justify-end">
                                      {canEdit && (
                                        <button 
                                          onClick={() => handleEditUser(userItem.id)}
                                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                                        >
                                          {t('adminEdit')}
                                        </button>
                                      )}
                                      {canManageRoles(user) && (
                                        <button className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300">
                                          {t('adminDelete')}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'news' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminNewsManagement')}
                      </h2>
                      {canAccessTab(user, 'news') && (
                        <button 
                          onClick={handleAddArticle}
                          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          {t('adminAddNews')}
                        </button>
                      )}
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-primary text-quinary-tint-800">
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminTitle')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminCategory')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminType')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminViews')}</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-quinary-tint-500">
                            {newsData.map((news) => (
                              <tr key={news.id} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.title[i18n.language]}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.category[i18n.language]}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.type}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.views}</td>
                                <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                  <div className="flex gap-2 justify-end">
                                    {canAccessTab(user, 'news') && (
                                      <button 
                                        onClick={() => handleEditArticle(news.id)}
                                        className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                                      >
                                        {t('adminEdit')}
                                      </button>
                                    )}
                                    {canManageRoles(user) && (
                                      <button className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300">
                                        {t('adminDelete')}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shop' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminShopManagement')}
                      </h2>
                      <button className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300">
                        {t('adminAddProduct')}
                      </button>
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl p-6">
                      <p className="text-secondary">{t('adminNoProducts')}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className={`text-[24px] font-bold text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('adminSettings')}
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-quinary-tint-600 rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-secondary mb-4">{t('adminGeneralSettings')}</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">{t('adminMaintenanceMode')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">{t('adminEnableComments')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;