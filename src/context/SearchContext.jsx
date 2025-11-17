import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext({ 
  searchQuery: () => {},
  updateSearchQuery: () => {},
});

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const ctxValue = { 
    searchQuery,
    updateSearchQuery,
  }

  return (
    <SearchContext.Provider value={ctxValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 