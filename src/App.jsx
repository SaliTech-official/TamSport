import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Divider from "./components/Divider"
import ContactBoxes from "./components/ContactBoxes"
import Home from "./pages/Home"
import About from "./pages/About"
import Shop from "./pages/Shop"
import News from "./pages/News"
import NewsDetail from "./components/NewsDetail"
import LogoSection from "./components/LogoSection"
import Error from "./pages/Error"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Admin from './pages/Admin';
import UserForm from './pages/UserForm';
import ArticleForm from './pages/ArticleForm';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-quinary-tint-600">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user/add" element={<UserForm />} />
            <Route path="/admin/user/edit/:userId" element={<UserForm />} />
            <Route path="/admin/article/add" element={<ArticleForm />} />
            <Route path="/admin/article/edit/:id" element={<ArticleForm />} />
            <Route path="*" element={<Error />} />
          </Routes>
          <Divider />
          <ContactBoxes />
          <Divider />
          <Footer />
          <LogoSection />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
