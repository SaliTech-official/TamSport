import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'
// Removed motion, AnimatePresence imports from 'framer-motion'
import NewsFilter from '../../components/blog/NewsFilter'
import NewsBox from '../../components/blog/NewsBox'
import SpinLoader from '../../pages/UI/SpinLoader'
import SomethingWentWrong from '../../pages/UI/SomethingWentWrong'
import NoArticlesFound from '../../pages/UI/NoArticlesFound'
import useHttp from '../../hooks/useHttp'
import FilterSummary from '../../components/FilterSummary'


// Removed containerVariants and itemVariants definitions

export default function News() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { searchQuery } = useSearch();
  const navigate = useNavigate();x

  const [requestUrl, setRequestUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    const typeParam = params.get('type');
    const categoryParam = params.get('category');
    let teamParam = params.get('team'); // Use let as we might modify it

    // Validate teamParam: ensure it's either empty or a string representation of a number
    if (teamParam && isNaN(parseInt(teamParam))) {
      teamParam = ''; // Treat invalid team param as empty
      params.delete('team'); // Also remove it from params for the URL in the address bar
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }

    // Always reset page to 1 on initial load unless explicitly navigating to a specific page
    // If there are other filters present, ensure page is 1. If only 'page' is present, it's a load more scenario.
    const currentPageParam = params.get('page');
    params.delete('page'); // Always start fresh with page 1 if filters change

    let searchUrl = `/api/blog/articles`
    let searchParams = new URLSearchParams();
    if (searchParam) {
      searchParams.set('search', searchParam);
    }
    if (typeParam) {
      searchParams.set('type', typeParam);
    }
    // if (categoryParam) {
    //   searchUrl.searchParams.set('category', categoryParam);
    // }
    if (teamParam) { // This will now only be true if teamParam is a valid number string or non-empty
      searchParams.set('team', teamParam);
    }

    // Add page back if it was specifically for load more scenario (only 'page' param present)
    if (currentPageParam && params.toString() === '') {
      searchParams.set('page', currentPageParam);
      searchParams.set('fetch-all', 'true');
    } else {
      // For new filters or refresh, always fetch page 1 initially
      searchParams.set('page', '1');
      searchParams.set('fetch-all', 'true'); // Always fetch all for now, as per pagination logic
    }

    return `${searchUrl}?${searchParams.toString()}`;
  });
  const [allArticles, setAllArticles] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(() => {
    const teamFromUrl = new URLSearchParams(window.location.search).get('team');
    // Also validate selectedTeam initial state
    return (teamFromUrl && !isNaN(parseInt(teamFromUrl))) ? teamFromUrl : '';
  });


  const activeFilter = new URLSearchParams(window.location.search).get("type");
  const searchParam = new URLSearchParams(window.location.search).get("search");
  const categoryParam = new URLSearchParams(window.location.search).get("category");
  const currentPage = new URLSearchParams(window.location.search).get("page") || "1";
  const teamParam = new URLSearchParams(window.location.search).get("team");

  const {
    isLoading,
    isError,
    data: response,
    errorMessage,
    sendRequest
  } = useHttp(requestUrl, false);

  const handleFilterChange = (filterId, filterType) => {
    const params = new URLSearchParams(window.location.search);

    // Clear category when type or team filter changes (search persists)
    if (filterType === 'type' || filterType === 'team') {
      // params.delete('search'); // REMOVED: Allow search to persist
      params.delete('category');
      // Update searchQuery in context if needed
      // setSearchQuery('');
    }

    if (filterId !== 'all' && filterId !== '') { // Also handle empty string for team filter
      params.set(filterType, filterId);
    } else {
      params.delete(filterType);
    }
    params.delete('page'); // Reset page to 1 when changing filter

    navigate(`${window.location.pathname}?${params.toString()}`);
    setAllArticles([]); // Clear articles to show new filtered results
  };

  // Effect to update articles when URL changes (after navigation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    const typeParam = params.get('type');
    const categoryParam = params.get('category');
    const pageParam = params.get('page');
    const teamParam = params.get('team');

    // Reset list before fetching new results on any filter/nav change
    setAllArticles([]);
    // Also keep selectedTeam in sync with URL (valid numeric or empty)
    setSelectedTeam(teamParam && !isNaN(parseInt(teamParam)) ? teamParam : '');

    let newSearchUrl = `/api/blog/articles`
    let newSearchParams = new URLSearchParams();
    if (searchParam) {
      newSearchParams.set('search', searchParam);
    }
    if (typeParam) {
      newSearchParams.set('type', typeParam);
    }
    if (categoryParam) {
      newSearchParams.set('category', categoryParam);
    }
    if (teamParam) {
      newSearchParams.set('team', teamParam);
    }
    if (pageParam) {
      newSearchParams.set('page', pageParam);
      newSearchParams.set('fetch-all', 'true');
    } else { // If pageParam is not present, ensure it's page 1 for new filter sets
      newSearchParams.set('page', '1');
      newSearchParams.set('fetch-all', 'true');
    }
    setRequestUrl(`${newSearchUrl}?${newSearchParams.toString()}`);
  }, [window.location.search]); // Depend on window.location.search

  // This useEffect handles setting allArticles when response changes and clears articles
  // when response is null (e.g. on new filter apply)
  useEffect(() => {
    if (response?.articles) {
      setAllArticles(prev => [...prev, ...response.articles]);
    } else if (response?.detail === 'no articles found!') {
      setAllArticles([]); // Clear articles if no articles found for the filter
    }
  }, [response]);


  const hasNext = response?.next || false;

  const handleLoadMore = () => {
    if (hasNext) {
      const nextPage = parseInt(currentPage) + 1;
      const params = new URLSearchParams(window.location.search);
      params.set('page', nextPage.toString());
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      setRequestUrl(response.next);
    }
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    params.delete('category');
    params.delete('page'); // Clear page parameter as well

    const typeParamValue = params.get('type');
    if (typeParamValue) {
      navigate(`/news?type=${typeParamValue}`);
    } else {
      navigate('/news');
    }
    // window.location.reload(); // REMOVED: Rely on useEffect for re-fetch
    setAllArticles([]);
  };

  const handleClearAllFilters = () => {
    navigate('/news');
    // window.location.reload(); // REMOVED: Rely on useEffect for re-fetch
    setAllArticles([]);
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
  };

  const handleApplyTeamFilter = () => {
    handleFilterChange(selectedTeam, 'team');
  };

  if (isError) {
    return <SomethingWentWrong />;
  }
  
  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-4"> 
        
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
          selectedTeam={selectedTeam}
          onTeamChange={handleTeamChange}
          onApplyTeamFilter={handleApplyTeamFilter}
        />
        
        {/* Filter Summary */}
        <FilterSummary 
          contentType={activeFilter} 
          team={teamParam} 
          search={searchParam} 
          onClearAllFilters={handleClearAllFilters}
        />
        {
          (((isLoading || allArticles.length == 0) && response?.detail !== 'no articles found!' && (!requestUrl.includes("page") || (requestUrl.includes("page") && requestUrl.includes("fetch-all"))))) ?  <SpinLoader /> :(
            (response?.detail === 'no articles found!') ? (
              <div
                className="flex flex-col items-center justify-center min-h-[60vh] w-full"
              >
                <NoArticlesFound />
              </div>
            ) : (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                
                  {allArticles.length > 0 && allArticles.map((article) => (
                    <div
                      key={article.id}
                    >
                      <NewsBox {...article} />
                    </div>
                  ))}
                
              </div>
            )
          )
        }
        
        {hasNext && allArticles.length > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">{t('newsLoadMore')}</span>
                </div>
              ) : (
                <span className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">{t('newsLoadMore')}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}