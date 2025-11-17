import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-24 h-24 rounded-full bg-quaternary bg-opacity-10 flex items-center justify-center mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-quaternary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V8m0 0V6m0 2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-quaternary mb-4">دسترسی غیرمجاز</h1>
      <p className="text-secondary text-lg mb-8 max-w-md">
        شما مجوز لازم برای دسترسی به این بخش را ندارید. لطفاً با مدیر سیستم تماس بگیرید.
      </p>
      <Link 
        to="/admin" 
        className="px-6 py-3 bg-gradient-to-l from-primary to-primary-tint-200 text-quinary-tint-800 rounded-lg shadow-md hover:from-primary-tint-200 hover:to-primary transition-colors duration-200 font-medium"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  );
};

export default AccessDenied; 