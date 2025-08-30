import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useHttp from '../../hooks/useHttp';

const NewsFilter = ({ activeFilter, onFilterChange, selectedTeam, onTeamChange, onApplyTeamFilter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const teamDropdownRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const [articleTypeOptions, setArticleTypeOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const { sendRequest: fetchFilterData, isLoading: isLoadingFilterData, isError: isErrorFilterData } = useHttp(
    `/api/blog/article-filter-data`,
    true, // Send immediately on mount
    'GET'
  );

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const data = await fetchFilterData();
        if (data) {
          // The backend now sends article types under the 'status' key and statuses under the 'type' key
          const formattedArticleTypes = Object.entries(data.status).map(([key, value]) => ({
            id: key === '' ? 'all' : key,
            label: value,
          }));
          setArticleTypeOptions(formattedArticleTypes);

          const formattedTeams = Object.entries(data.teams).map(([key, value]) => ({
            id: key,
            label: value,
          }));
          setTeamOptions(formattedTeams);

          console.log("Fetched filter data:", data);
          console.log("Formatted Article Type Options:", formattedArticleTypes);
          console.log("Formatted Team Options:", formattedTeams);
        }
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
        // Handle error, e.g., show a message to the user
      }
    };

    loadFilterData();
  }, [fetchFilterData, t]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) {
        setIsTeamDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterClick = (filterId, filterType = 'type') => {
    console.log(filterId, filterType);
    onFilterChange(filterId, filterType);
    setIsMobileMenuOpen(false);
  };

  const selectedArticleTypeLabel = articleTypeOptions.find(f => f.id === activeFilter)?.label || t('newsAll');
  const selectedTeamLabel = teamOptions.find(t => t.id === selectedTeam)?.label || t('All Teams');

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 relative" ref={menuRef}>
      {/* Main Filters (Article Type) */}
      <div className="w-full sm:w-auto relative">
        {/* Mobile Menu Button (Article Type) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(open => !open)}
          className="sm:hidden w-full flex items-center justify-between px-4 py-2 bg-quinary-tint-800 rounded-lg text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300"
          aria-haspopup="listbox"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="text-[16px] font-medium">
            {selectedArticleTypeLabel}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {/* Mobile Menu Dropdown with animation (Article Type) */}
        <div
          className={`sm:hidden absolute top-full left-0 right-0 mt-1 bg-quinary-tint-800 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50 transition-all duration-300 ease-in-out transform origin-top ${
            isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
          role="listbox"
        >
          {[...articleTypeOptions].reverse().map((filter) => (
            <button
              key={filter.id}
              onClick={() => activeFilter !== filter.id ? handleFilterClick(filter.id, 'type') : undefined}
              className={`w-full px-4 py-2 text-left text-[16px] font-medium transition-colors ${
                activeFilter === filter.id || (filter.id === 'all' && !activeFilter) 
                  ? 'text-quaternary bg-quinary-tint-700'
                  : 'text-secondary hover:text-quaternary hover:bg-quinary-tint-700'
              }`}
              role="option"
              aria-selected={activeFilter === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {/* Desktop Menu (Article Type) */}
        <nav className="hidden sm:flex items-center gap-4 md:gap-6">
          {[...articleTypeOptions].reverse().map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id, 'type')}
              className={`text-[16px] md:text-[18px] lg:text-[20px] font-medium transition-all duration-300 relative group ${
                activeFilter === filter.id || (filter.id === 'all' && !activeFilter) ? 'text-quaternary' : 'text-secondary hover:text-quaternary'
              }`}
              role="option"
              aria-selected={activeFilter === filter.id}
            >
              {filter.label}
              <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
                activeFilter === filter.id || (filter.id === 'all' && !activeFilter)  ? 'w-full bg-quaternary' : 'group-hover:w-full bg-quaternary'
              }`}></span>
            </button>
          ))}
        </nav>
      </div>
      {/* Advanced Filter Dropdown (Team) */}
      <div className="w-full sm:w-auto relative" ref={teamDropdownRef}>
        <label className="block mb-1 text-primary font-semibold text-[15px]" htmlFor="advanced-team-filter">
          {t('Team')}
        </label>
        <button
          type="button"
          className="w-full sm:w-64 flex items-center justify-between px-4 py-2 bg-quinary-tint-800 rounded-lg text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300 text-[16px] font-medium border border-quaternary-200"
          onClick={() => setIsTeamDropdownOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isTeamDropdownOpen}
          id="advanced-team-filter"
        >
          <span>{selectedTeamLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 ${isTeamDropdownOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {/* Dropdown List */}
        <div
          className={`absolute left-0 sm:left-auto sm:right-0 w-full sm:w-64 mt-1 bg-quinary-tint-800 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50 transition-all duration-300 ease-in-out transform origin-top ${
            isTeamDropdownOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <ul
            className="max-h-60 overflow-y-auto py-1 custom-scrollbar"
            tabIndex={-1}
            role="listbox"
          >
            {teamOptions.map((team) => (
              <li
                key={team.id}
                role="option"
                aria-selected={selectedTeam === team.id}
                className={`px-4 py-2 cursor-pointer text-[16px] font-medium transition-colors rounded-lg ${
                  selectedTeam === team.id
                    ? 'text-quaternary bg-quinary-tint-700'
                    : 'text-secondary hover:text-quaternary hover:bg-quinary-tint-700'
                }`}
                onClick={() => {
                  onTeamChange(team.id);
                }}
              >
                {team.label}
              </li>
            ))}
          </ul>
          {/* Apply Filter Button (only visible when open) */}
          <div className="p-2 border-t border-quaternary-200 flex justify-end bg-quinary-tint-800 rounded-b-lg">
            <button
              type="button"
              className="w-full px-4 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition border border-primary text-base"
              onClick={() => {
                onApplyTeamFilter();
                setIsTeamDropdownOpen(false);
              }}
            >
              {t('applyFilter')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFilter; 