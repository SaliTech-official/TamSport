import { Route, Routes, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// blog routes
import Home from './pages/blog/Home';
import About from './pages/blog/About';
import Shop from './pages/Shop';
import News from './pages/blog/News';
import NewsDetail from './components/blog/NewsDetail';
// auth routes
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import PageNotFound from './pages/UI/PageNotFound';
import OtpVerification from './pages/auth/OtpVerification';
import Register from './pages/auth/Register';
// admin routes
import AdminLayout from './layout/AdminLayout'  ;
import Dashboard from './pages/admin/page/Dashboard';
import Users from './pages/admin/page/Users';
import AdminNews from './pages/admin/page/News';
import AdminShop from './pages/admin/page/Shop';
import Players from './pages/admin/page/Players';
import PlayerForm from './pages/admin/add/PlayerForm';
import EditPlayerForm from './pages/admin/edit/EditPlayerForm';
import EditUserForm from './pages/admin/edit/EditUserForm'; // New import
import UserForm from './pages/admin/add/UserForm';
import PreRegister from './pages/blog/PreRegister';
import Teams from './pages/admin/page/Teams';
import TeamForm from './pages/admin/add/TeamForm';
import EditTeamForm from './pages/admin/edit/EditTeamForm';
import NewsForm from './pages/admin/add/NewsForm';
import EditNewsForm from './pages/admin/edit/EditNewsForm';


const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

const WebsiteRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* BLOG routes */}
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        <Route path="/shop" element={
          <PageTransition>
            <Shop />
          </PageTransition>
        } />
        <Route path="/news" element={
          <PageTransition>
            <News />
          </PageTransition>
        } />
        <Route path="/news/:slug" element={
          <PageTransition>
            <NewsDetail />
          </PageTransition>
        } />
        <Route path="/pre-register" element={
          <PageTransition>
            <PreRegister />
          </PageTransition>
        } />

        {/* AUTH routes */}
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/otp-code" element={
          <PageTransition>
            <OtpVerification />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <Profile />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <PageNotFound />
          </PageTransition>
        } />

        {/* ADMIN routes - بدون PageTransition */}
        <Route path="/admin/*" element={<AdminLayout />} >
          <Route index element={<Dashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="shop" element={<AdminShop />} />
          <Route path="players" element={<Players />} />
          <Route path="players/add" element={<PlayerForm />} />
          <Route path="players/edit/:playerId" element={<EditPlayerForm />} />
          <Route path="users" element={<Users />} />
          <Route path="users/edit/:userId" element={<EditUserForm />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/add" element={<TeamForm />} />
          <Route path="teams/edit/:teamId" element={<EditTeamForm />} />
          <Route path="news/add" element={<NewsForm />} />
          <Route path="news/edit/:articleId" element={<EditNewsForm />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      
      </Routes>
    </AnimatePresence>
  );
};

export { WebsiteRoutes };
