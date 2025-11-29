import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UsersTable from '../../../components/admin/Table/UsersTable';
import UsersFilter from '../../../components/admin/Filter/UsersFilter';
import AdminPagination from '../../../components/admin/AdminPagination';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, totalPages: 1 });
  const [users, setUsers] = useState([]);
  
  // Extract all filter values from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '5');
  const search = searchParams.get('search') || '';
  const userType = searchParams.get('userType') || '';
  const isActive = searchParams.get('isActive') || '';

  // Fetch users data
  const url = `/api/admin/users/?page=${currentPage}&page_size=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${userType ? `&user_type=${userType}` : ''}${isActive ? `&is_active=${isActive}` : ''}`;
  const { isLoading, data, isError, errorContent, sendRequest: getUsers } = useAdminHttp(url);
  
  // Update users and pagination info when data changes
  useEffect(() => {
    if (data && data.results) {
      setUsers(data.results);
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
    if (updates.search !== undefined || updates.userType !== undefined || updates.isActive !== undefined) {
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

  const handlePageChangeAfterDeactivate = () => {
    getUsers(); // Refresh the user list after deactivation
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">   
        <h1 className="text-3xl font-bold text-primary">مدیریت کاربران</h1>
        <button 
          onClick={() => navigate('/admin/users/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          کاربر جدید
        </button>
      </div>
      
      {/* Filter Component */}
      <UsersFilter 
        search={search}
        userType={userType}
        isActive={isActive}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />
      
      {/* Users Table Component */}
      {isLoading ? (
        <SpinLoader />
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        <UsersTable 
          navigate={navigate}
          users={users}
          getUsers={getUsers}
          currentPage={currentPage}
          totalItems={paginationInfo.count}
          onPageChangeAfterDeactivate={handlePageChangeAfterDeactivate}
        />
      )}
      
      {/* Pagination Component */}
      {paginationInfo.count > 8 && (
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

export default Users; 