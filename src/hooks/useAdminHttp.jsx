import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Custom hook for making authenticated HTTP requests to the admin API
 * @param {string} url - The API URL to request (optional if using sendRequest directly)
 * @param {object} options - Request options (optional)
 * @returns {object} The state and methods for making HTTP requests
 */
const useAdminHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ isError: false, errorContent: '' });
  const [data, setData] = useState([]);

  const { tokens, refreshToken, logout } = useAuth();

  /**
   * Handles token expiration by trying to refresh it
   */
  const handleUnauthorized = useCallback(async () => {
    try {
      const newTokens = await refreshToken();

      if (newTokens?.access) {
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        return true;
      }
    } catch (err) {
      console.error('Token refresh error:');
    }
    return false;
  }, [refreshToken]);

  /**
   * Custom fetch logic with token and FormData support
   */
  const customFetchFunction = async (url, options = {}) => {
    const isFormData = options?.body instanceof FormData;

    const headers = {
      ...options?.headers,
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
      headers['Accept-Language'] = 'fa';
    }

    const requestOptions = {
      ...options,
      headers,
    };

    

    let response = await fetch(url, requestOptions);
    let responseData;

    
    try {
      responseData = await response.json();
    } catch (err) {
      responseData = { message: 'Invalid JSON response from server.' };
    }

    // Handle token expiration and retry
    if (response.status === 401 && responseData?.messages?.[0]?.message === 'Token is expired') {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        requestOptions.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`;
        response = await fetch(url, requestOptions);
        responseData = await response.json();
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (response.status === 401) {
      if (responseData?.messages?.[0]?.message === 'Token is expired') {
        window.location.reload();
      } else if (responseData?.messages?.[0]?.message === 'Token is invalid') {
        logout();
      }
    }
    
    if (!response.ok && response.status === 404) {
      return {
        isError: true,
        errorContent: {detail:"page not found."},
      };
    }

    

    if (!response.ok) {
      return {
        isError: true,
        errorContent: responseData,
      };
    }

    return responseData;
  };

  /**
   * Function to send requests manually (POST, PUT, DELETE, PATCH, GET)
   */
  const sendRequest = useCallback(async (requestUrl = null, requestMethod = null, requestData = null) => {
    setIsLoading(true);
    try {
      let responseData;
      const finalUrl = requestUrl || url;

      let body;
      let isFormData = false;

      if (requestData instanceof FormData) {
        body = requestData;
        isFormData = true;
      } else if (requestData !== null && typeof requestData === 'object') {
        body = JSON.stringify(requestData);
      } 

      const options = {
        method: requestMethod || 'GET',
        body: body,
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': 'fa',
        },
      };

      responseData = await customFetchFunction(finalUrl, options);
      setData(responseData);
      return responseData;
    } catch (err) {
      setError({ isError: true, errorContent: err.message });
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  // Auto-fetch if URL is provided initially
  useEffect(() => {
    if (url) {
      sendRequest();
    }
  }, [url, options]);

  return {
    isLoading,
    data,
    sendRequest,
    isError: error.isError,
    errorContent: error.errorContent,
  };
};

export default useAdminHttp;
