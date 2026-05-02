import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, initials = 'SA' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-warning flex items-center justify-center text-white font-black text-xs md:text-sm border-2 md:border-4 border-white dark:border-[#12122A] card-shadow hover:scale-105 transition-transform active:scale-95"
      >
        {user?.initials || initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#12122A] border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-border bg-surface-light dark:bg-white/5">
            <p className="text-sm font-black text-text dark:text-white truncate">{user?.name || 'Sara Abraham'}</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{user?.role || 'Senior Recruiter'}</p>
          </div>
          <div className="p-2">
            <button 
              onClick={() => { navigate('/settings'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-mid hover:text-primary hover:bg-primary-light dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <User size={16} /> Profile
            </button>
            <button 
              onClick={() => { navigate('/settings'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-mid hover:text-primary hover:bg-primary-light dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Settings size={16} /> Settings
            </button>
          </div>
          <div className="p-2 border-t border-border">
            <button 
              onClick={() => { 
                // Using a simple reload to clear state and redirect to login
                // In a real app, this would call a global logout function
                localStorage.clear();
                window.location.href = '/login'; 
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-error-bg rounded-xl transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
