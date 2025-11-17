import React from 'react';
import { motion } from 'framer-motion';
import AdminShopTab from '../../../components/admin/AdminShopTab';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-quinary-tint-600 flex items-center justify-center">
    <div className="bg-quaternary text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">منتظر بمانید...</h2>
    </div>
  </div>
  );
};

export default Shop; 