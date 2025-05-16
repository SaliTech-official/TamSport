import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Dashboard = () => {
  const { user, setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rememberedUser');
    navigate('/login');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Here you would typically upload the image to your server
        setMessage({ type: 'success', text: 'Profile picture updated successfully' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    // Here you would typically make an API call to change the password
    setMessage({ type: 'success', text: 'Password changed successfully' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the email
    setMessage({ type: 'success', text: 'Email updated successfully' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                      <span className="text-[24px] sm:text-[32px] font-bold text-quinary-tint-800">
                        {user?.phone?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-quinary-tint-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">Welcome Back!</h1>
                <p className="text-[16px] sm:text-[18px] text-secondary">{user?.phone}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-6 py-2 bg-quaternary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-300"
            >
              Logout
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

        {/* Tabs */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <div className="flex flex-wrap gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-[16px] font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-quinary-tint-800'
                    : 'bg-quinary-tint-700 text-secondary hover:bg-quinary-tint-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-quinary-tint-700 rounded-xl p-6">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-[24px] font-bold text-primary mb-4">Profile Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[16px] text-secondary mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={user?.phone}
                        disabled
                        className="w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 border-quinary-tint-600 focus:border-primary outline-none transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] text-secondary mb-2">Email</label>
                      <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 border-quinary-tint-600 focus:border-primary outline-none transition-colors duration-300"
                        />
                        <button 
                          type="submit"
                          className="px-6 py-2 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300"
                        >
                          Update Email
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold text-primary mb-4">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[16px] text-secondary mb-2">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 border-quinary-tint-600 focus:border-primary outline-none transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] text-secondary mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 border-quinary-tint-600 focus:border-primary outline-none transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] text-secondary mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-quinary-tint-800 text-secondary rounded-lg border-2 border-quinary-tint-600 focus:border-primary outline-none transition-colors duration-300"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-[24px] font-bold text-primary mb-4">Your Orders</h2>
                <div className="text-[16px] text-secondary">No orders found.</div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-[24px] font-bold text-primary mb-4">Your Favorites</h2>
                <div className="text-[16px] text-secondary">No favorites found.</div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-[24px] font-bold text-primary mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-quinary-tint-800 rounded-lg">
                    <div>
                      <h3 className="text-[18px] font-medium text-secondary">Email Notifications</h3>
                      <p className="text-[14px] text-secondary-tint-500">Receive updates about your orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-quinary-tint-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-quinary-tint-800 rounded-lg">
                    <div>
                      <h3 className="text-[18px] font-medium text-secondary">SMS Notifications</h3>
                      <p className="text-[14px] text-secondary-tint-500">Receive updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-quinary-tint-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 