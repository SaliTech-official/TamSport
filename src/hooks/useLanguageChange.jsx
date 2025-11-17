import { useEffect } from 'react';

const useLanguageChange = () => {
  useEffect(() => {
    // Function to handle language changes
    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem('language');
      if (currentLang) {
        // Immediately reload the page without any delay
        window.location.href = window.location.href;
      }
    };

    // Add event listener for the custom event
    window.addEventListener('languageChange', handleLanguageChange);

    // Cleanup
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
};

export default useLanguageChange; 