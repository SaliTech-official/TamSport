import React, { useState, useEffect } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { AdminIcons } from '../../../data/Icons';
import { API_PREFIX } from '../../../reverse_proxy';

const UsersFilter = ({
  search,
  userType,
  isActive,
  onFilterChange,
  onClearAllFilters
}) => {
  const [searchInput, setSearchInput] = useState(search || '');
  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const isActiveOptions = [
    { value: '', label: 'همه وضعیت‌ها' },
    { value: 'true', label: 'فعال' },
    { value: 'false', label: 'غیرفعال' },
  ];

  // Check if any filters are active
  const hasActiveFilters = search !== '' || userType !== '' || isActive !== '';

  // Fetch filter options from backend
  const { data: filterData, isLoading: filterLoading, isError: filterError } = useAdminHttp(
    `${API_PREFIX}/admin/user-filter-data/`
  );

  // Initialize search input when search prop changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Update user type options when filter data changes
  useEffect(() => {
    if (filterData && filterData.user_permissions) {
      const options = Object.entries(filterData.user_permissions).map(([value, label]) => ({ value, label }));
      setUserTypeOptions([{ value: '', label: 'همه انواع' }, ...options]);
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

  const handleUserTypeChange = (e) => {
    onFilterChange('userType', e.target.value);
  };

  const handleIsActiveChange = (e) => {
    onFilterChange('isActive', e.target.value);
  };

  if (filterLoading) return <SpinLoader />;
  if (filterError) return <SomethingWentWrong />;

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

      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search group */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-secondary">جستجو</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="شماره موبایل، نام یا نام خانوادگی را وارد کنید..."
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
              className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium"
            >
              جستجو
            </button>
          </div>
        </div>

        {/* User Type group */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-secondary">نوع کاربر</label>
          <select
            value={userType}
            onChange={handleUserTypeChange}
            className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
            dir="rtl"
          >
            {userTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Is Active group */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-secondary">وضعیت کاربر</label>
          <select
            value={isActive}
            onChange={handleIsActiveChange}
            className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
            dir="rtl"
          >
            {isActiveOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default UsersFilter; 