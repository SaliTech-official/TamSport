import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useHttp from '../hooks/useHttp';


const FilterSummary = ({ contentType, team, search, onClearAllFilters }) => {
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
          // Backend now sends article types under the 'status' key
          const formattedArticleTypes = Object.entries(data.status).map(([key, value]) => ({
            id: key,
            label: value,
          }));
          setArticleTypeOptions(formattedArticleTypes);

          const formattedTeams = Object.entries(data.teams).map(([key, value]) => ({
            id: key,
            label: value,
          }));
          setTeamOptions(formattedTeams);

          console.log("FilterSummary - Fetched filter data:", data);
          console.log("FilterSummary - Formatted Article Type Options:", formattedArticleTypes);
          console.log("FilterSummary - Formatted Team Options:", formattedTeams);
        }
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    loadFilterData();
  }, [fetchFilterData]);

  const getContentTypeLabel = (typeId) => {
    const option = articleTypeOptions.find(option => option.id === typeId);
    return option ? option.label : '';
  };

  const getTeamLabel = (teamId) => {
    const option = teamOptions.find(option => option.id === teamId);
    return option ? option.label : '';
  };

  const hasSearch = search && search.trim();
  const hasContentType = contentType && contentType !== 'all';
  const hasTeam = team && team.trim();

  // Always show a message, even with default values
  const showDefaultMessage = !hasSearch && !hasContentType && !hasTeam;

  const generateMessage = () => {
    if (isRTL) {
      const filters = [];
      
      if (hasContentType && hasTeam) {
        filters.push(`نوع مقاله ${getContentTypeLabel(contentType)} و تیم ${getTeamLabel(team)}`);
      } else if (hasContentType) {
        filters.push(`نوع مقاله ${getContentTypeLabel(contentType)}`);
      } else if (hasTeam) {
        filters.push(`تیم ${getTeamLabel(team)}`);
      }

      if (hasSearch) {
        if (filters.length > 0) {
          return `فیلتر شده بر اساس ${filters.join(' و ')}, جستجو شده بر اساس ${search}`;
        } else {
          return `جستجو شده بر اساس ${search}`;
        }
      } else if (filters.length > 0) {
        return `فیلتر شده بر اساس ${filters.join(' و ')}`;
      } else {
        return ""; // Return empty if no filters are active
      }
    } else {
      const filters = [];
      
      if (hasContentType && hasTeam) {
        filters.push(`content type: ${getContentTypeLabel(contentType)} and team: ${getTeamLabel(team)}`);
      } else if (hasContentType) {
        filters.push(`content type: ${getContentTypeLabel(contentType)}`);
      } else if (hasTeam) {
        filters.push(`team: ${getTeamLabel(team)}`);
      }

      if (hasSearch) {
        if (filters.length > 0) {
          return `Filtered by ${filters.join(' and ')}, searched for: ${search}`;
        } else {
          return `Searched for: ${search}`;
        }
      } else if (filters.length > 0) {
        return `Filtered by ${filters.join(' and ')}`;
      } else {
        return ""; // Return empty if no filters are active
      }
    }
  };

  const renderHighlightedMessage = () => {
    const message = generateMessage();
    
    if (!message) return null; // Don't render if no message

    if (isRTL) {
      // Persian highlighting
      let highlightedMessage = message;
      
      // Highlight content type
      if (hasContentType) {
        const contentTypeLabel = getContentTypeLabel(contentType);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(contentTypeLabel, 'g'),
          `<span class="text-quaternary font-semibold">${contentTypeLabel}</span>`
        );
      }
      
      // Highlight team
      if (hasTeam) {
        const teamLabel = getTeamLabel(team);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(teamLabel, 'g'),
          `<span class="text-quaternary font-semibold">${teamLabel}</span>`
        );
      }
      
      // Highlight search term
      if (hasSearch) {
        highlightedMessage = highlightedMessage.replace(
          new RegExp(search, 'g'),
          `<span class="text-quaternary font-semibold">${search}</span>`
        );
      }
      
      
      return highlightedMessage;
    } else {
      // English highlighting
      let highlightedMessage = message;
      
      // Highlight content type
      if (hasContentType) {
        const contentTypeLabel = getContentTypeLabel(contentType);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(contentTypeLabel, 'g'),
          `<span class="text-quaternary font-semibold">${contentTypeLabel}</span>`
        );
      }
      
      // Highlight team
      if (hasTeam) {
        const teamLabel = getTeamLabel(team);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(teamLabel, 'g'),
          `<span class="text-quaternary font-semibold">${teamLabel}</span>`
        );
      }
      
      // Highlight search term
      if (hasSearch) {
        highlightedMessage = highlightedMessage.replace(
          new RegExp(search, 'g'),
          `<span class="text-quaternary font-semibold">${search}</span>`
        );
      }
      
      
      return highlightedMessage;
    }
  };

  const message = renderHighlightedMessage();

  if (!message || isLoadingFilterData) {
    return null;
  }

  return (
    <div className="mt-0 mb-6 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p 
          className={`text-gray-600 text-sm font-medium flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        {onClearAllFilters && (hasSearch || hasContentType || hasTeam) && (
          <button
            onClick={onClearAllFilters}
            className={`ml-3 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 ${isRTL ? 'mr-3' : 'ml-3'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isRTL ? 'حذف فیلترها' : 'Clear Filters'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSummary; 