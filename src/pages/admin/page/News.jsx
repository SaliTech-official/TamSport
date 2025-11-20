import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NewsTable from '../../../components/admin/Table/NewsTable';
import NewsFilter from '../../../components/admin/Filter/NewsFilter';
import AdminPagination from '../../../components/admin/AdminPagination';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { API_PREFIX } from '../../../reverse_proxy';

const News = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, totalPages: 1 });
  const [articles, setArticles] = useState([]);
  
  // Extract all filter values from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '5');
  const search = searchParams.get('search') || '';
  const searchLanguage = searchParams.get('searchLanguage') || 'fa';
  const status = searchParams.get('status') || '';
  const type = searchParams.get('type') || '';
  const team = searchParams.get('team') || '';
  
  // Fetch articles data
  const url = `${API_PREFIX}/admin/articles/?page=${currentPage}&page_size=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${status ? `&status=${status}` : ''}${type ? `&type=${type}` : ''}${team ? `&team=${team}` : ''}${searchLanguage ? `&search_language=${searchLanguage}` : ''}`;
  const {
    isLoading,
    data,
    isError,
    errorContent,
    sendRequest: getArticles
  } = useAdminHttp(url);
  
  // Update articles and pagination info when data changes
  useEffect(() => {
    if (data && data.results) {
      setArticles(data.results);
      setPaginationInfo({
        count: data.count,
        totalPages: Math.ceil(data.count / itemsPerPage)
      });
    }
  }, [data, itemsPerPage]);
  
  // Helper function to update search params
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Apply all updates to the search params
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // If we're updating filters that should reset pagination, set page to 1
    if (updates.search !== undefined || updates.status !== undefined || 
        updates.type !== undefined || updates.team !== undefined || 
        updates.searchLanguage !== undefined) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleItemsPerPageChange = (newSize) => {
    updateSearchParams({ 
      pageSize: newSize.toString(),
      page: '1' 
    });
  };
  
  const handleFilterChange = (filterType, value) => {
    updateSearchParams({ [filterType]: value });
  };
  
  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1', pageSize: itemsPerPage.toString() }));
  };

  const handlePageChangeAfterDelete = () => {
    if (articles.length === 1 && currentPage > 1) {
      updateSearchParams({ page: (currentPage - 1).toString() });
    } else {
      getArticles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">   
        <h1 className="text-3xl font-bold text-primary">مدیریت مقالات</h1>
        <button 
          onClick={() => navigate('/admin/news/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          مقاله جدید
        </button>
      </div>
      
      {/* Filter Component */}
      <NewsFilter 
        search={search}
        searchLanguage={searchLanguage}
        status={status}
        type={type}
        team={team}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />
      
      {/* Articles Table Component */}
      {isLoading ? (
        <SpinLoader />
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        <NewsTable 
          navigate={navigate}
          articles={articles}
          getArticles={getArticles}
          currentPage={currentPage}
          totalItems={paginationInfo.count}
          onPageChangeAfterDelete={handlePageChangeAfterDelete}
        />
      )}
      
      {/* Pagination Component */}
      {paginationInfo.count > 5 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={paginationInfo.totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={paginationInfo.count}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default News; 