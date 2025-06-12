import { ROLES } from '../utils/roles';

export const fakeUsers = [
  { 
    id: '1',
    phone: '09917982521', 
    password: '1234',
    first_name: 'علی',
    last_name: 'احمدی',
    role: ROLES.AUTHOR,
    is_active: true,
    last_login: '2024-01-15 14:30:00',
    created_date: '2024-01-01'
  },
  { 
    id: '2',
    phone: '09998887766', 
    password: 'abcd',
    first_name: 'مریم',
    last_name: 'محمدی',
    role: ROLES.SUPER_ADMIN,
    is_active: true,
    last_login: '2024-01-14 09:15:00',
    created_date: '2024-01-02'
  },
  { 
    id: '3',
    phone: '09351234567', 
    password: 'pass123',
    first_name: 'حسین',
    last_name: 'رضایی',
    role: ROLES.SELLER,
    is_active: true,
    last_login: '2024-01-10 16:45:00',
    created_date: '2024-01-03'
  },
  { 
    id: '4',
    phone: '09123456789', 
    password: 'admin123',
    first_name: 'فاطمه',
    last_name: 'کریمی',
    role: ROLES.ADMIN,
    is_active: true,
    last_login: '2024-01-12 11:20:00',
    created_date: '2024-01-04'
  },
  { 
    id: '5',
    phone: '09387654321', 
    password: 'editor123',
    first_name: 'محمد',
    last_name: 'جعفری',
    role: ROLES.USER,
    is_active: true,
    last_login: '2024-01-08 13:45:00',
    created_date: '2024-01-05'
  },
  { 
    id: '6',
    phone: '09111111111', 
    password: 'super123',
    first_name: 'زهرا',
    last_name: 'حسینی',
    role: ROLES.SUPER_ADMIN,
    is_active: true,
    last_login: '2024-01-16 08:30:00',
    created_date: '2024-01-06'
  }
]; 