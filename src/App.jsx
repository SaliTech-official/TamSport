import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

// AuthContext setup (move to its own file in a real project)
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  // In a real app, you would check localStorage, cookies, or an API
  const [user, setUser] = useState(null); // null means not logged in
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
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
            <Route path="*" element={<Error />} />
          </Routes>
          <Divider />
          <ContactBoxes />
          <Divider />
          <Footer />
          <LogoSection />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
export { AuthContext };
