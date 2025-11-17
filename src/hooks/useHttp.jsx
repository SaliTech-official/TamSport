import { useState, useCallback, useEffect } from 'react';

const customFetchFunction = async (url, options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': localStorage.getItem("language", "fa")
  },
}) => {
  const res = await fetch(url, options);
  const resData = await res.json();

  if (!res.ok) {
    // Handle error messages from the server
    let errorMessage;
    if (typeof resData === 'object') {
      // If the error is an object, create key-value pairs
      errorMessage = Object.entries(resData).reduce((acc, [key, value]) => {
        // If value is an array, take the first element
        const errorValue = Array.isArray(value) ? value[0] : value;
        acc[key] = errorValue;
        return acc;
      }, {});
    } else {
      // If it's a simple string/number, keep it as is
      errorMessage = resData;
    }
    throw new Error(JSON.stringify(errorMessage));
  }

  return resData;
};

const useHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorMessage: null
  });
  const [data, setData] = useState(null);

  const sendRequest = useCallback(async (requestData = null) => {
    setIsLoading(true);
    setError({ isError: false, errorMessage: null });
    
    try {
      let responseData;
      if (requestData) {
        responseData = await customFetchFunction(url, {...options, body: JSON.stringify(requestData)});
      } else {
        responseData = await customFetchFunction(url);
      }
      setData(responseData);
      
      return responseData
    } catch (err) {
      let errorMessage;
      try {
        errorMessage = JSON.parse(err.message) 
      } catch (error) {
        errorMessage = err.message
      }
      setError({
        isError: true,
        errorMessage: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if ((options && options.method === 'GET') || (!options)) {
      sendRequest();
    }
  }, [url, options, sendRequest]);

  return {
    isLoading,
    data,
    sendRequest,
    isError: error.isError,
    errorMessage: error.errorMessage
  };
};

export default useHttp;