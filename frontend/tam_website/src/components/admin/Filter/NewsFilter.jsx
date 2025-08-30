import React, { useState, useEffect } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { AdminIcons } from '../../../data/Icons';

const NewsFilter = ({ 
  search, 
  searchLanguage, 
  status,
  type,
  team,
  onFilterChange, 
  onClearAllFilters 
}) => {
  const [searchInput, setSearchInput] = useState(search || '');
  const [statusOptions, setStatusOptions] = useState({});
  const [typeOptions, setTypeOptions] = useState({});
  const [teamOptions, setTeamOptions] = useState({});
  
  // Check if any filters are active
  const hasActiveFilters = search !== '' || status !== '' || type !== '' || team !== '' || searchLanguage !== 'fa';

  // Fetch filter options
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError
  } = useAdminHttp('/api/admin/article-filter-data/?filter_page=True');

  // Initialize search input when search prop changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Update filter options when data changes
  useEffect(() => {
    if (filterData) {
      if (filterData.status) {
        setStatusOptions(filterData.status);
      }
      if (filterData.type) {
        setTypeOptions(filterData.type);
      }
      if (filterData.teams) {
        setTeamOptions(filterData.teams);
      }
    }
  }, [filterData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange('search', searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange('search', '');
  };

  const handleStatusChange = (e) => {
    onFilterChange('status', e.target.value);
  };

  const handleTypeChange = (e) => {
    onFilterChange('type', e.target.value);
  };

  const handleTeamChange = (e) => {
    onFilterChange('team', e.target.value);
  };

  const handleSearchLanguageChange = (e) => {
    onFilterChange('searchLanguage', e.target.value);
  };

  if (filterLoading) return <SpinLoader />;
  if (filterError) return <SomethingWentWrong />;

  console.log(teamOptions);

  return (
    <div className="bg-quinary-tint-700 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary mb-2 sm:mb-0">فیلترها</h2>
        {hasActiveFilters && (
          <button 
            onClick={onClearAllFilters}
            className="px-4 py-2 bg-quaternary-tint-700 text-secondary rounded-lg hover:bg-quaternary-tint-600 transition-colors duration-200 flex items-center gap-2"
          >
            <AdminIcons.ClearSearch />
            پاک کردن همه فیلترها
          </button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="grid grid-cols-12 gap-3">
        {/* Search group - takes more space */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">جستجو</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="عنوان مقاله را وارد کنید..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="px-3 py-2 pr-4 rounded-lg border border-quinary-tint-400 focus:outline-none focus:ring-2 focus:ring-primary text-right w-full bg-quinary-tint-800 text-primary pl-8"
                  dir="rtl"
                />
                {search !== '' && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-quaternary transition-colors duration-200"
                  >
                    <AdminIcons.ClearSearch />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium whitespace-nowrap"
              >
                جستجو
              </button>
            </div>
          </div>
        </div>

        {/* Language group - smaller */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">زبان جستجو</label>
            <select
              value={searchLanguage}
              onChange={handleSearchLanguageChange}
              className="px-2 py-2 text-sm rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              <option value="fa">فارسی</option>
              <option value="en">انگلیسی</option>
            </select>
          </div>
        </div>

        {/* Status group - smaller */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">وضعیت</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="px-2 py-2 text-sm rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              {Object.entries(statusOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Type group - smaller */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">نوع</label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="px-2 py-2 text-sm rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              {Object.entries(typeOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team group - smaller */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">تیم</label>
            <select
              value={team}
              onChange={handleTeamChange}
              className="px-2 py-2 text-sm rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              {Object.entries(teamOptions).reverse().map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewsFilter; 