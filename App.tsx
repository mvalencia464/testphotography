
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Admin } from './pages/Admin';
import { PortfolioProvider } from './context/PortfolioContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AuthProvider } from './context/AuthContext';

// Layout wrapper for the main landing page
const LandingLayout: React.FC = () => {
  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 selection:bg-amber-500/30">
      <Navbar />
      <Hero />
      <Portfolio />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <PortfolioProvider>
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingLayout />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </HashRouter>
        </PortfolioProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
};

export default App;
