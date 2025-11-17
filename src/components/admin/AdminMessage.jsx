import React from 'react';

const AdminMessage = ({ type, text }) => {
  if (!text) return null;
  return (
    <div className={`mb-4 p-4 rounded-lg ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {text}
    </div>
  );
};

export default AdminMessage;
