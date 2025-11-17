import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpinLoader from '../../../components/UI/SpinLoader';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // هدایت به داشبورد
    navigate('/admin', { replace: true });
  }, [navigate]);

  return <SpinLoader />;
};

export default Admin;
