import React from 'react';

const AdminShopTab = ({ navigate }) => {
  // TODO: Replace with real products data from backend
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-bold text-primary">
          مدیریت فروشگاه
        </h2>
        <button 
          onClick={() => navigate('/admin/product/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
        >
          محصول جدید
        </button>
      </div>
      <div className="bg-quinary-tint-600 rounded-xl p-6">
        <p className="text-secondary">محصولی برای نمایش وجود ندارد</p>
      </div>
    </div>
  );
};

export default AdminShopTab; 