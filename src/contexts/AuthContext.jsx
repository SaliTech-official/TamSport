import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { getUserRole, ROLES } from '../utils/roles';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      // Clear any old user data first
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedUser');
      
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      
      // Find user in fakeUsers data
      const foundUser = fakeUsers.find(user => user.phone === phone);
      
      if (foundUser) {
        // User exists in our system
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      } else {
        // Create a new user with default role
        const newUser = {
          id: Date.now().toString(),
          phone,
          first_name: '',
          last_name: '',
          role: ROLES.USER,
          is_active: true
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (phone, password) => {
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful registration
      const newUser = {
        id: Date.now().toString(),
        phone,
        first_name: '',
        last_name: '',
        role: ROLES.USER,
        is_active: true
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Here you would typically make an API call to your backend
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const setUserRole = (role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    setUserRole,
    setUser,
    clearAllData,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 