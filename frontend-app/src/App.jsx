import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Mic, 
  FileCheck, 
  Settings, 
  Briefcase, 
  Calendar, 
  GraduationCap,
  LogOut,
  ClipboardList,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { MockDB } from './utils/MockDatabase';

import Dashboard from './screens/Dashboard';
import Landing from './screens/Landing';
import JDAnalysis from './screens/JDAnalysis';
import CandidateQueue from './screens/CandidateQueue';
import SemanticScoring from './screens/SemanticScoring';
import InterviewRoom from './screens/InterviewRoom';
import CandidateScorecard from './screens/CandidateScorecard';
import ShortlistDashboard from './screens/ShortlistDashboard';
import SettingsScreen from './screens/Settings';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import InterviewTask from './screens/InterviewTask';
import Appointments from './screens/Appointments';
import Training from './screens/Training';

const Sidebar = ({ onLogout, user, theme, onToggleTheme, isOpen, onClose }) => {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/recruitment', label: 'Recruitment', icon: Users },
    { path: '/interview', label: 'Interview', icon: Mic },
    { path: '/onboarding', label: 'Onboarding', icon: Briefcase },
    { path: '/interview-task', label: 'Interview Task', icon: ClipboardList },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/training', label: 'Training', icon: GraduationCap },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    // Close sidebar on navigation (mobile)
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0A0A1A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div className={`w-64 bg-white dark:bg-[#12122A] h-screen fixed left-0 top-0 border-r border-border flex flex-col pt-6 sidebar-shadow z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <img src="/hirewell-logo.png" alt="HireWell Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
            <h1 className="font-serif text-xl font-bold text-text tracking-tight">HireWell</h1>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

      <div className="px-6 mb-10">
        <Link to="/settings" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-lg group-hover:scale-105 transition-transform">
              {user?.initials || 'SA'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 overflow-hidden">
             <div className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">{user?.name || 'Sara Abraham'}</div>
             <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">View profile</div>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-primary text-white shadow-md shadow-primary/30' 
                  : 'text-text-mid hover:text-primary hover:bg-primary-light'
              }`}
            >
              <Icon size={18} />
              <span className="font-bold text-[13.5px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button 
          onClick={onToggleTheme}
          className="flex items-center gap-3 px-4 py-3 text-text-mid hover:text-primary transition-colors w-full group rounded-xl hover:bg-primary-light"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="font-bold text-[13.5px]">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-error transition-colors w-full group rounded-xl hover:bg-error-bg"
        >
          <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
          <span className="font-bold text-[13.5px]">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(MockDB.get().theme || 'light');
  const [user, setUser] = useState(MockDB.get().user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    MockDB.setTheme(newTheme);
  };

  useEffect(() => {
    // Sync user data on mount and interval
    const interval = setInterval(() => {
      const data = MockDB.get();
      setUser(data.user);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Keep html-level dark class in sync for consistent dark: styles.
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={`flex min-h-screen bg-background text-text selection:bg-primary/20 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
        {!isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#12122A]/80 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-6">
               <div className="flex items-center gap-3">
                 <img src="/hirewell-logo.png" alt="HireWell Logo" className="w-8 h-8 object-contain" />
                 <span className="font-serif font-bold text-lg">HireWell</span>
               </div>
               <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-primary-light text-primary rounded-xl">
                 <Menu size={20} />
               </button>
            </div>

            <Sidebar 
              onLogout={handleLogout} 
              user={user} 
              theme={theme} 
              onToggleTheme={toggleTheme} 
              isOpen={mobileMenuOpen} 
              onClose={() => setMobileMenuOpen(false)} 
            />
            <main className="flex-1 lg:ml-64 p-0 pt-16 lg:pt-0 relative min-h-screen overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recruitment" element={<Landing />} />
                <Route path="/analysis" element={<JDAnalysis />} />
                <Route path="/upload" element={<CandidateQueue />} />
                <Route path="/scoring" element={<SemanticScoring />} />
                <Route path="/interview" element={<InterviewRoom />} />
                <Route path="/scorecard" element={<CandidateScorecard />} />
                <Route path="/shortlist" element={<ShortlistDashboard />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/interview-task" element={<InterviewTask />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/training" element={<Training />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
