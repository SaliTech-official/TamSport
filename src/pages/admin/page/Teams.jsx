import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TeamTable from '../../../components/admin/Table/TeamTable';
import TeamFilter from '../../../components/admin/Filter/TeamFilter';
import AdminPagination from '../../../components/admin/AdminPagination';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { API_PREFIX } from '../../../reverse_proxy';

const Teams = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, totalPages: 1 });
  const [teams, setTeams] = useState([]);

  // Extract filter values from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '5');
  const search = searchParams.get('search') || '';
  const searchLanguage = searchParams.get('searchLanguage') || 'fa';

  // Fetch teams data
  const url = `${API_PREFIX}/admin/team-list/?page=${currentPage}&page_size=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${searchLanguage ? `&search_language=${searchLanguage}` : ''}`;
  const {
    isLoading,
    data,
    isError,
    errorContent,
    sendRequest: getTeams
  } = useAdminHttp(url);

  useEffect(() => {
    if (data && data.results) {
      setTeams(data.results);
      setPaginationInfo({
        count: data.count,
        totalPages: Math.ceil(data.count / itemsPerPage)
      });
    }
  }, [data, itemsPerPage]);

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    if (updates.search !== undefined || updates.searchLanguage !== undefined) {
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
    if (teams.length === 1 && currentPage > 1) {
      updateSearchParams({ page: (currentPage - 1).toString() });
    } else {
      getTeams();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">   
        <h1 className="text-3xl font-bold text-primary">مدیریت تیم‌ها</h1>
        <button 
          onClick={() => navigate('/admin/teams/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          تیم جدید
        </button>
      </div>
      {/* Filter Component */}
      <TeamFilter 
        search={search}
        searchLanguage={searchLanguage}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />
      {/* Teams Table Component */}
      {isLoading ? (
        <SpinLoader />
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        <TeamTable 
          navigate={navigate}
          teams={teams}
          getTeams={getTeams}
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

export default Teams; 