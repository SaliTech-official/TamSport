import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_PREFIX } from '../reverse_proxy';


export const AuthContext = createContext(
  {
    login: () => {},
    logout: () => {},
    register: () => {},
    refreshToken: () => {},
    isAuthenticated: () => {},
    isAdminPannelAccess: () => {},
    isAdmin: () => {},
  }
);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ isAdminPannelAccess, setIsAdminPannelAccess ] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens');
    if (storedTokens) {
      try {
        const accessToken = (JSON.parse(storedTokens).access).split('.')[1];
        const decodedToken = accessToken ? atob(accessToken) : null;

        setIsAuthenticated(JSON.parse(decodedToken)?.user_id);
      } catch (error) {
        console.error('Error parsing tokens:', error);
        localStorage.removeItem('tokens');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {

    const checkAdminPannelAccess = async () => {
      try {
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens) {
          setIsAdmin(false);
          setIsAdminPannelAccess(false);
          return;
        }

        const accessToken = JSON.parse(storedTokens).access;
        const response = await fetch(`${API_PREFIX}/admin/admin-pannel-access`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...authHeader(),
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdminPannelAccess(true);
          setUser(data.user);
        } else if (response.status === 403 || response.status === 401) {
          setIsAdminPannelAccess(false);
          setIsAdmin(false);
        } else {
          setIsAdminPannelAccess({isError:true})
        }

      } catch (error) {
        setIsAdminPannelAccess({isError:true})
      }
    };

    checkAdminPannelAccess();

  }, [isAuthenticated]);


  const login = async (phone_number, password) => {
    try {

      const response = await fetch(`${API_PREFIX}/auth/get-access-token/`, {
        method: 'POST',
        headers: {
          ...authHeader()
        },
        body: JSON.stringify({phone_number, password})
      });
      const data = await response.json();

      

      if (!response.ok) {
        return { success: false, error: data.error }
      }
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify({access: data.access, refresh: data.refresh}));
      
      setIsAuthenticated(true);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      console.log(error.message);
      
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_PREFIX}/auth/register/`, {
        method: 'POST',
        headers: {
          ...authHeader(),
        },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, error: data }
      }
            
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    navigate('/login');
  };

  

  const refreshToken = async () => {
    try {
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error('No tokens found');
      }
      const refreshToken = JSON.parse(storedTokens).refresh;
      const res = await fetch(`${API_PREFIX}/auth/get-refresh-token/`, {
        method: 'POST',
        headers: {
          ...authHeader(),
        },
        body: JSON.stringify({
          refresh:refreshToken
        })
      });
      const data = await res.json();
      
      if (data?.code === "token_not_valid") {
        logout();
      }
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const authHeader = () => {
    return {
      'Accept-Language': localStorage.getItem("language", 'fa'),
      'Content-Type': "application/json"
    }
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      register,
      refreshToken,
      isAuthenticated,
      isAdminPannelAccess,
      isAdmin,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 