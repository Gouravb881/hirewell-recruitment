import React, { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Download, Bell, CheckCircle2, ArrowUpDown, Filter, UserCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';
import { getActiveJobId, listCandidates, listMatches } from '../api/matchingApi';
import UserMenu from '../components/UserMenu';

const ShortlistDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

  const user = MockDB.get().user;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const data = MockDB.get();
        const jobId = getActiveJobId() || 1;
        
        // 1. Load Candidates
        let candList = [];
        try {
          candList = await listCandidates(jobId);
        } catch (e) {
          candList = data.candidates || [];
        }
        setCandidates(candList);

        // 2. Load Matches (Screening Results)
        let matchList = [];
        const savedResults = localStorage.getItem("screeningResults");
        
        if (savedResults) {
          matchList = JSON.parse(savedResults);
        } else {
          try {
            matchList = await listMatches(jobId);
          } catch (e) {
            // Fallback: Generate matches from processed candidates in MockDB
            matchList = candList.map(c => ({
              candidate_id: c.id,
              final_score: c.score || Math.floor(60 + Math.random() * 30),
              decision: c.score >= 80 ? 'Shortlist' : 'Review',
              confidence_score: 92
            }));
          }
        }
        setMatches(matchList);
      } catch (err) {
        console.error("Critical error loading shortlist:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Filtering Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // Find matching screening result
      const match = matches.find((m) => String(m.candidate_id) === String(c.id));
      
      // If we are in "All" filter, show everything even if no match yet (for UI completeness)
      // but usually we want to show matched results
      if (!match && filter !== 'All') return false;

      const decision = match?.decision?.toLowerCase() || (c.score >= 80 ? 'shortlist' : 'review');
      const matchesFilter = filter === 'All' || 
        (filter === 'Strongly Recommend' && decision === 'shortlist') || 
        (filter === 'Recommend' && decision === 'review') || 
        (filter === 'Hold' && (decision === 'hold' || decision === 'rejected' || decision === 'reject'));

      const matchesSearch = String(c.id).toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.file_name && c.file_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
      return matchesFilter && matchesSearch;
    });
  }, [candidates, matches, filter, searchQuery]);

  // Sorting Logic
  const sortedCandidates = useMemo(() => {
    const sortableItems = [...filteredCandidates];
    sortableItems.sort((a, b) => {
      const matchA = matches.find(m => String(m.candidate_id) === String(a.id));
      const matchB = matches.find(m => String(m.candidate_id) === String(b.id));
      
      const scoreA = matchA?.final_score || a.score || 0;
      const scoreB = matchB?.final_score || b.score || 0;

      if (sortConfig.key === 'score') {
        return sortConfig.direction === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      }
      return 0;
    });
    return sortableItems;
  }, [filteredCandidates, matches, sortConfig]);

  const handleExport = () => {
    const headers = ['Rank', 'Candidate ID', 'Name', 'Final Score', 'Decision', 'Confidence'];
    const rows = sortedCandidates.map((c, i) => {
      const m = matches.find(m => String(m.candidate_id) === String(c.id));
      return [
        i + 1,
        c.id,
        c.name || c.file_name,
        m?.final_score || c.score || '-',
        m?.decision || '-',
        m?.confidence_score || '-'
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HireWell_Shortlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted font-bold animate-pulse">Analyzing results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="text-center md:text-left w-full md:w-auto">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-text dark:text-white mb-2 tracking-tight">Ranked Shortlist</h1>
          <div className="flex items-center justify-center md:justify-start gap-3">
             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">Clinical Audit v4.2</span>
             <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-widest">{candidates.length} Profiles Scanned</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#12122A] border border-border px-6 py-3 rounded-2xl text-sm font-bold text-text-mid hover:text-primary transition-all shadow-sm">
              <Download size={18} /> <span className="hidden sm:inline">Export CSV</span><span className="sm:hidden">Export</span>
           </button>
           <UserMenu user={user} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
           <div className="bg-white dark:bg-[#12122A] border border-border p-3 rounded-[28px] card-shadow flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto pb-2 md:pb-0">
                {['All', 'Strongly Recommend', 'Recommend', 'Hold'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-primary hover:bg-primary-light dark:hover:bg-white/5'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                 <input 
                  type="text" 
                  placeholder="Search by ID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-primary text-text dark:text-white" 
                 />
              </div>
           </div>
        </div>

        <div className="lg:col-span-9">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-[#12122A] border border-border rounded-[32px] overflow-hidden card-shadow">
              <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead>
                    <tr className="bg-surface-light dark:bg-white/5 border-b border-border text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                       <th className="py-6 pl-8">Rank</th>
                       <th className="py-6">Candidate</th>
                       <th className="py-6">Match Score</th>
                       <th className="py-6">Decision</th>
                       <th className="py-6 pr-8 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {sortedCandidates.map((c, i) => {
                      const m = matches.find(match => String(match.candidate_id) === String(c.id));
                      const score = m?.final_score || c.score || 0;
                      const decision = m?.decision || (score >= 80 ? 'Shortlist' : 'Review');
                      
                      return (
                        <tr key={c.id} className="border-b border-border group hover:bg-primary-light/10 transition-colors">
                           <td className="py-8 pl-8">
                              <span className="font-serif text-3xl font-bold text-text-muted/20 group-hover:text-primary/20 transition-colors">{i + 1}</span>
                           </td>
                           <td className="py-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-surface-light dark:bg-white/5 flex items-center justify-center text-text-muted">
                                    <UserCheck size={20} />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-text dark:text-white uppercase tracking-widest">#{c.id}</div>
                                    <div className="text-[10px] text-text-muted font-bold truncate max-w-[150px]">{c.name || c.file_name}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="py-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-24 h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${score}%` }}></div>
                                 </div>
                                 <span className="font-serif font-bold text-xl text-primary">{score}</span>
                              </div>
                           </td>
                           <td className="py-8">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                decision.toLowerCase() === 'shortlist' ? 'bg-success-bg text-success border-success/20' : 
                                decision.toLowerCase() === 'review' ? 'bg-primary-light text-primary border-primary/20' : 
                                'bg-warning-bg text-warning border-warning/20'
                              }`}>
                                {decision}
                              </span>
                           </td>
                           <td className="py-8 pr-8 text-right">
                              <button 
                                onClick={() => navigate('/scorecard', { state: { candidateId: c.id } })}
                                className="w-10 h-10 rounded-xl bg-surface-light dark:bg-white/5 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white transition-all shadow-sm group-hover:shadow-md"
                              >
                                 <ExternalLink size={18} />
                              </button>
                           </td>
                        </tr>
                      );
                    })}
                    {sortedCandidates.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                           <div className="text-5xl mb-4 opacity-10">🔍</div>
                           <h3 className="font-serif font-bold text-lg text-text-muted">No Candidates Found</h3>
                           <p className="text-xs text-text-muted mt-1">Try adjusting your filters or search query.</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4">
              {sortedCandidates.map((c, i) => {
                const m = matches.find(match => String(match.candidate_id) === String(c.id));
                const score = m?.final_score || c.score || 0;
                const decision = m?.decision || (score >= 80 ? 'Shortlist' : 'Review');
                
                return (
                  <div 
                    key={c.id}
                    onClick={() => navigate('/scorecard', { state: { candidateId: c.id } })}
                    className="bg-white dark:bg-[#12122A] border border-border rounded-2xl p-5 card-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-12 h-12 bg-surface-light dark:bg-white/5 flex items-center justify-center rounded-br-2xl border-r border-b border-border">
                       <span className="font-serif text-xl font-black text-primary/30">{i + 1}</span>
                    </div>
                    
                    <div className="flex flex-col items-center text-center mt-6 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 shadow-inner">
                        <UserCheck size={28} />
                      </div>
                      <div className="text-xs font-black text-text dark:text-white uppercase tracking-[0.2em] mb-1">#{c.id}</div>
                      <div className="text-[10px] text-text-muted font-bold truncate max-w-full px-4">{c.name || c.file_name}</div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 py-4 border-t border-border">
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Match Strength</span>
                             <span className="text-xs font-black text-primary">{score}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${score}%` }}></div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         decision.toLowerCase() === 'shortlist' ? 'bg-success-bg text-success border-success/20' : 
                         decision.toLowerCase() === 'review' ? 'bg-primary-light text-primary border-primary/20' :
                         'bg-warning-bg text-warning border-warning/20'
                       }`}>
                         {decision}
                       </span>
                       <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          View Details <ExternalLink size={12} />
                       </button>
                    </div>
                  </div>
                );
              })}
              {sortedCandidates.length === 0 && (
                 <div className="py-20 text-center bg-white dark:bg-[#12122A] rounded-2xl border border-border">
                    <div className="text-5xl mb-4 opacity-10">🔍</div>
                    <h3 className="font-serif font-bold text-lg text-text-muted">No Candidates Found</h3>
                 </div>
              )}
            </div>   
        </div>

        <aside className="lg:col-span-3 space-y-6">
           <div className="bg-white dark:bg-[#12122A] border border-border rounded-[32px] p-8 card-shadow">
              <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
                 <ArrowUpDown className="text-primary" size={20} /> Distribution
              </h3>
              <div className="space-y-6">
                 {[
                    { label: 'Shortlisted', count: matches.filter(m => m.decision?.toLowerCase() === 'shortlist').length, color: 'bg-success' },
                    { label: 'Review', count: matches.filter(m => m.decision?.toLowerCase() === 'review').length, color: 'bg-primary' },
                    { label: 'Hold/Reject', count: matches.filter(m => m.decision?.toLowerCase() === 'reject').length, color: 'bg-warning' },
                 ].map(stat => (
                   <div key={stat.label}>
                      <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                         <span>{stat.label}</span>
                         <span className="text-text dark:text-white">{stat.count}</span>
                      </div>
                      <div className="h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.color}`} style={{ width: `${(stat.count / (matches.length || 1)) * 100}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary rounded-[32px] p-8 text-white shadow-2xl shadow-primary/20">
              <h3 className="font-serif font-bold text-xl mb-4">Batch Finalized?</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-8">
                 Ready to move to the next stage? Advance these candidates to technical tasks or interview loops.
              </p>
              <button onClick={() => navigate('/interview-task')} className="w-full bg-white text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all">
                 Assign Tasks
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default ShortlistDashboard;
