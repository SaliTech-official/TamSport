import React, { createContext, useContext, useState, useEffect } from 'react';
import useHttp from '../hooks/useHttp';

const HomeContext = createContext();

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ children }) => {
  const [homeData, setHomeData] = useState({
    articles: [],
    videos: [],
    tam_teams: [],
    players: []
  });

  const {
    isLoading,
    isError,
    data: response,
    sendRequest
  } = useHttp(`https://tam-django.liara.run/blog/home-datas/`, false);

  useEffect(() => {
    if (response) {
      setHomeData({
        articles: response.articles || [],
        videos: response.videos || [],
        tam_teams: response.tam_teams || [],
        players: response.players || []
      });
    }
  }, [response]);

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

  const value = {
    homeData,
    isLoading,
    isError
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

export default HomeContext; 