export const scrollToSection = (sectionId, navigate) => {
  // If we're not on the home page, navigate there first
  if (window.location.pathname !== '/') {
    navigate('/');
  }

  // Wait for the page to load and then scroll to the section
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
};

export const navigateToNewsWithFilter = (filter, navigate) => {
  navigate(`/news?type=${filter}`);
  
  // Wait for the page to load and then scroll to top
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 100);
};

export const scrollToAboutSection = (sectionId, navigate) => {
  // If we're not on the about page, navigate there first
  if (window.location.pathname !== '/about') {
    navigate('/about');
  }

  // Wait for the page to load and then scroll to the section
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = -100; // Offset in pixels
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 100);
}; 