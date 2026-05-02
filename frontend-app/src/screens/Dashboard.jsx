import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, MoreHorizontal, Phone, MessageSquare, Calendar } from 'lucide-react';
import { MockDB } from '../utils/MockDatabase';
import UserMenu from '../components/UserMenu';

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jd, setJd] = useState(null);
  const [db, setDb] = useState({});

  useEffect(() => {
    const data = MockDB.get();
    setDb(data);
    setCandidates(data.candidates || []);
    setJd(data.jd);
  }, []);
  
  const openRoles = [
    { title: 'UX Designer', count: 5, icon: '🎨', path: '/recruitment' },
    { title: 'Backend Engineer', count: 8, icon: '💻', path: '/recruitment' },
    { title: 'iOS Developer', count: 10, icon: '📱', path: '/recruitment' },
    { title: 'ML Engineer', count: 6, icon: '🤖', path: '/recruitment' },
    { title: 'Data Analyst', count: 4, icon: '📊', path: '/recruitment' },
  ];

  const recruitmentProgress = candidates.map(c => {
    let target = '/scorecard';
    if (c.stage === 'Interviewed' || c.stage === 'Technical Interview') target = '/interview';
    else if (c.stage === 'Task Assigned' || c.stage === 'Task Done') target = '/interview-task';
    else if (c.stage === 'Onboarding' || c.stage === 'Hired') target = '/onboarding';

    let color = 'bg-primary';
    if (c.status === 'Pending' || c.taskStatus === 'Pending') color = 'bg-warning';
    
    return {
      id: `Candidate #${c.id}`,
      originalId: c.id,
      role: jd?.title || 'Open Role',
      score: c.compositeScore ? `${c.compositeScore} / 10` : c.score ? `${c.score} / 10` : 'N/A',
      stage: c.stage || 'Uploaded',
      status: c.status || 'Ready',
      color: color,
      target: target
    };
  });

  const handleRowClick = (target, id) => {
    navigate(target, { state: { candidateId: id } });
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96 order-2 md:order-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search candidates, roles..." 
            className="w-full bg-white dark:bg-[#12122A] border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary card-shadow"
          />
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4 order-1 md:order-2">
          <button onClick={() => navigate('/recruitment')} className="bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all">
            <Plus size={18} /> <span className="hidden sm:inline">Add New Role</span><span className="sm:hidden">New Role</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-[#12122A] border border-border rounded-xl flex items-center justify-center text-text-mid cursor-pointer card-shadow hover:bg-surface-light transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-[#12122A]"></div>
            </div>
            <UserMenu user={db.user} />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-10 overflow-hidden">
          {/* Welcome Card */}
          <div className="bg-primary rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-xl shadow-primary/10">
            <div className="relative z-10 max-w-lg text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Good Morning, {db.user?.name?.split(' ')[0] || 'Sara'} 👋</h1>
              <div className="text-primary-light opacity-90 leading-relaxed mb-8 text-sm md:text-base">
                You have <span className="font-bold underline">12 new applications</span> awaiting AI screening.<br className="hidden md:block"/>
                HireWell is ready to analyze — bias-blind.
              </div>
              <button 
                onClick={() => navigate('/recruitment')}
                className="w-full md:w-auto bg-white text-primary px-8 py-3.5 rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95"
              >
                Start Screening →
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-32 md:w-64 flex items-center justify-center opacity-10 md:opacity-100 pointer-events-none">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-primary-light/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <div className="text-5xl md:text-8xl">🤖</div>
              </div>
            </div>
          </div>

          {/* Open Roles */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Open Roles to Fill</h2>
              <button onClick={() => navigate('/recruitment')} className="text-xs font-bold text-primary px-4 py-1.5 bg-primary-light rounded-full">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {openRoles.map((role) => (
                <div 
                  key={role.title} 
                  onClick={() => navigate(role.path, { state: { jobTitle: role.title } })}
                  className="bg-white dark:bg-[#12122A] border border-border rounded-[24px] p-4 md:p-6 text-center card-shadow hover:translate-y-[-4px] transition-transform cursor-pointer group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-light dark:bg-[#1A1A35] rounded-xl flex items-center justify-center text-xl md:text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform">{role.icon}</div>
                  <h3 className="text-xs md:text-sm font-bold mb-1 truncate">{role.title}</h3>
                  <p className="text-[9px] md:text-[10px] text-text-muted font-bold uppercase tracking-wider">{role.count} Candidates</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recruitment Progress */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Recruitment Progress</h2>
              <button onClick={() => navigate('/shortlist')} className="text-xs font-bold text-primary px-4 py-1.5 bg-primary-light rounded-full">View Leaderboard</button>
            </div>
            <div className="bg-white dark:bg-[#12122A] border border-border rounded-[32px] overflow-x-auto card-shadow scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-surface-light/50 dark:bg-white/5">
                    <th className="py-5 pl-8">Candidate ID</th>
                    <th className="py-5">Applied Role</th>
                    <th className="py-5">Semantic Score</th>
                    <th className="py-5">Stage</th>
                    <th className="py-5">Status</th>
                    <th className="py-5 pr-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {recruitmentProgress.map((row, i) => (
                    <tr 
                      key={i} 
                      onClick={() => handleRowClick(row.target, row.originalId)}
                      className={`group hover:bg-primary-light/30 transition-colors cursor-pointer ${i === recruitmentProgress.length - 1 ? '' : 'border-b border-border'}`}
                    >
                      <td className="py-5 pl-8 font-bold text-sm">{row.id}</td>
                      <td className="py-5 text-sm font-medium text-text-mid">{row.role}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success-bg px-2 py-1 rounded-full w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                          {row.score}
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-text-mid">{row.stage}</td>
                      <td className="py-5">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${row.color === 'bg-primary' ? 'bg-primary-light text-primary' : 'bg-warning-bg text-warning'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${row.color}`}></div>
                           {row.status}
                        </div>
                      </td>
                      <td className="py-5 pr-8 text-right">
                        <div className="bg-surface-light w-8 h-8 rounded-lg flex items-center justify-center text-text-muted group-hover:bg-white transition-colors">
                           <MoreHorizontal size={16} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-white dark:bg-[#12122A] border border-border rounded-[32px] p-6 card-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-text dark:text-white">Schedule Calendar</h3>
              <div onClick={() => navigate('/appointments')} className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-light dark:bg-white/5 px-2 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                <Calendar size={12} /> May
              </div>
            </div>
            {/* Simple calendar mock */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI'].map(d => (
                <div key={d} className="text-[10px] font-bold text-text-muted text-center">{d}</div>
              ))}
              {[22, 23, 24, 25, 26].map(n => (
                <div 
                  key={n} 
                  onClick={() => navigate('/appointments')}
                  className={`py-3 rounded-xl text-center text-xs font-bold transition-colors cursor-pointer ${n === 24 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-mid dark:text-text-muted hover:bg-surface-light dark:hover:bg-white/5'}`}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-serif font-bold">New Applicants</h3>
              <button onClick={() => navigate('/shortlist')} className="text-[10px] font-bold text-primary">View All</button>
            </div>
            {candidates.slice(0, 4).map((c, i) => {
              const colors = ['bg-primary', 'bg-error', 'bg-success', 'bg-warning'];
              const initial = c.name ? c.name.substring(0, 2).toUpperCase() : 'CA';
              return (
              <div key={c.id} onClick={() => navigate('/scorecard', { state: { candidateId: c.id } })} className="bg-white dark:bg-[#12122A] border border-border rounded-2xl p-4 flex items-center gap-3 card-shadow cursor-pointer hover:translate-x-1 transition-transform group">
                <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0`}>{initial}</div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold truncate group-hover:text-primary transition-colors text-text dark:text-white">Candidate #{c.id}</div>
                  <div className="text-[10px] text-text-muted font-medium truncate">Applied for {jd?.title || 'Open Role'}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-white/5 flex items-center justify-center text-text-muted hover:text-primary cursor-pointer transition-colors"><MessageSquare size={14} /></div>
                  <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-white/5 flex items-center justify-center text-text-muted hover:text-primary cursor-pointer transition-colors"><Phone size={14} /></div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-[#12122A] border border-border rounded-[32px] p-6 card-shadow">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-text dark:text-white">Ready for AI Interview</h3>
              <button onClick={() => navigate('/interview')} className="text-[10px] font-bold text-primary">View Queue</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {(candidates.filter(c => c.stage !== 'Uploaded').length > 0 ? candidates.filter(c => c.stage !== 'Uploaded') : candidates).slice(0, 4).map((c, i) => (
                <div 
                  key={c.id} 
                  onClick={() => navigate('/interview', { state: { candidateId: c.id } })}
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md cursor-pointer hover:scale-110 hover:rotate-6 transition-all ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-error' : 'bg-success'}`}
                >
                  {c.id}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
