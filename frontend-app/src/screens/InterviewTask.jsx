import React, { useState, useEffect } from 'react';
import { Code, Send, CheckCircle2, AlertCircle, Search, Plus, ChevronRight, FileCode, Zap, Clock } from 'lucide-react';
import { MockDB } from '../utils/MockDatabase';

const TASK_LIBRARY = [
  { title: 'React Performance Optimization', category: 'Frontend', difficulty: 'Hard', description: 'Optimize a slow React app: reduce re-renders, implement lazy loading, and improve Core Web Vitals.' },
  { title: 'REST API Design Challenge', category: 'Backend', difficulty: 'Medium', description: 'Design and implement a RESTful API for a task management system with authentication and pagination.' },
  { title: 'SQL Query Optimization', category: 'Database', difficulty: 'Medium', description: 'Analyze and rewrite 5 underperforming SQL queries, add proper indexes, and document your reasoning.' },
  { title: 'System Architecture Design', category: 'Architecture', difficulty: 'Hard', description: 'Design a microservices architecture for a high-traffic e-commerce platform handling 1M daily users.' },
  { title: 'Data Pipeline Implementation', category: 'ML/Data', difficulty: 'Hard', description: 'Build an ETL pipeline that ingests, transforms, and loads data from 3 sources into a data warehouse.' },
  { title: 'CSS Layout & Accessibility', category: 'Frontend', difficulty: 'Easy', description: 'Recreate a given design using CSS Grid/Flexbox and ensure WCAG AA accessibility compliance.' },
];

const diffColor = (d) => d === 'Hard' ? 'bg-error-bg text-error' : d === 'Medium' ? 'bg-warning-bg text-warning' : 'bg-success-bg text-success';
const statusColor = (s) => s === 'Evaluated' ? 'bg-success-bg text-success' : s === 'Assigned' ? 'bg-primary-light text-primary' : 'bg-surface-light text-text-muted';

const InterviewTask = () => {
  const [candidates, setCandidates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [evaluating, setEvaluating] = useState(null);

  const loadData = () => {
    const data = MockDB.get();
    
    // Sort candidates so the highest matching ones appear first for task assignment
    const allCandidates = [...(data.candidates || [])].sort((a, b) => {
      const scoreA = parseFloat(a.compositeScore || a.score || 0);
      const scoreB = parseFloat(b.compositeScore || b.score || 0);
      return scoreB - scoreA;
    });
    setCandidates(allCandidates);

    const taskList = allCandidates
      .filter(c => c.taskStatus && c.taskStatus !== 'Pending')
      .map(c => ({
        id: `T-${c.id}`,
        title: c.taskTitle || 'Technical Challenge',
        candidate: c.name || `Candidate #${c.id}`,
        candidateId: c.id,
        status: c.taskStatus,
        score: c.taskScore ? `${c.taskScore}/100` : '—',
        category: 'Technical',
        fileName: c.file_name || c.name,
      }));
    setTasks(taskList);
  };

  useEffect(() => { loadData(); }, []);

  const handleAssign = () => {
    if (!selectedCandidate || !selectedTask) return;
    MockDB.assignTask(selectedCandidate, selectedTask.title);
    setShowAssign(false);
    setSelectedCandidate(null);
    setSelectedTask(null);
    loadData();
  };

  const handleEvaluate = (taskCandidateId) => {
    setEvaluating(taskCandidateId);
    setTimeout(() => {
      const score = Math.floor(75 + Math.random() * 25);
      MockDB.submitTask(taskCandidateId, score);
      setEvaluating(null);
      loadData();
    }, 2000);
  };

  const filtered = tasks.filter(t => {
    const matchTab = activeTab === 'All' || t.status === activeTab;
    const matchSearch = t.candidate.toLowerCase().includes(search.toLowerCase()) || t.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text dark:text-white mb-1 tracking-tight text-primary">Interview Tasks</h1>
          <div className="flex items-center gap-3">
             <span className="bg-success-bg text-success px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-success/10">Stage 02: Verification</span>
             <p className="text-sm text-text-muted">{candidates.length} candidates · {tasks.length} tasks active</p>
          </div>
        </div>
        <button
          onClick={() => setShowAssign(true)}
          disabled={candidates.length === 0}
          className={`px-8 py-3.5 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-3 transition-all ${candidates.length > 0 ? 'bg-primary text-white shadow-primary/30 hover:translate-y-[-2px]' : 'bg-surface-light dark:bg-white/5 text-text-muted border border-border dark:border-white/10 cursor-not-allowed'}`}
        >
          <Plus size={18} /> Assign New Task
        </button>
      </header>

      {/* Assign Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-[#12122A] border border-border rounded-[48px] p-12 w-full max-w-2xl card-shadow animate-fade-in-up">
            <h2 className="text-3xl font-serif font-bold mb-10 text-text dark:text-white">Assign Technical Task</h2>

            <div className="mb-10">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">Select Top Shortlisted Candidate</div>
              <div className="space-y-4 max-h-56 overflow-y-auto pr-2 scrollbar-hide">
                {candidates.filter(c => !c.taskStatus || c.taskStatus === 'Pending').map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c.id)}
                    className={`p-6 rounded-[28px] border transition-all flex items-center gap-5 ${selectedCandidate === c.id ? 'border-primary bg-primary-light/30 shadow-xl shadow-primary/5' : 'border-border dark:border-white/10 hover:border-primary/40'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">#{c.id}</div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-text dark:text-white uppercase tracking-widest">{c.name || c.file_name}</div>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] text-primary font-bold">AI Match: {c.score || 0}%</span>
                         <span className="text-[10px] text-text-muted font-bold">·</span>
                         <span className="text-[10px] text-text-muted font-bold">Screened Stage</span>
                      </div>
                    </div>
                    {selectedCandidate === c.id && <CheckCircle2 className="text-primary" size={24} />}
                  </div>
                ))}
                {candidates.filter(c => !c.taskStatus || c.taskStatus === 'Pending').length === 0 && (
                  <div className="text-center py-12 bg-surface-light rounded-[32px] border border-dashed border-border">
                     <p className="text-text-muted italic text-sm">All candidates have active tasks.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-4">Select Task from Library</div>
              <div className="space-y-3 max-h-56 overflow-y-auto" style={{scrollbarWidth:'none'}}>
                {TASK_LIBRARY.map((t, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTask(t)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedTask?.title === t.title ? 'border-primary bg-primary-light dark:bg-primary/10' : 'border-border dark:border-white/10 hover:border-primary/40'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-text">{t.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${diffColor(t.difficulty)}`}>{t.difficulty}</span>
                        {selectedTask?.title === t.title && <CheckCircle2 className="text-primary" size={16} />}
                      </div>
                    </div>
                    <p className="text-[11px] text-text-muted line-clamp-1">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowAssign(false)} className="flex-1 py-4 rounded-2xl border border-border dark:border-white/10 text-text-mid dark:text-white font-bold hover:bg-surface-light dark:hover:bg-white/5 transition-all">Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedCandidate || !selectedTask}
                className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${selectedCandidate && selectedTask ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-surface-light dark:bg-white/5 text-text-muted border border-border dark:border-white/10 cursor-not-allowed'}`}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          {/* Filters */}
          <div className="flex items-center justify-between bg-surface border border-border p-3 rounded-2xl card-shadow">
            <div className="flex gap-2">
              {['All', 'Assigned', 'Evaluated'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-primary hover:bg-primary-light dark:hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search tasks or candidates..."
                className="w-full bg-surface-light dark:bg-white/5 border border-border dark:border-white/10 rounded-xl py-2.5 pl-12 text-xs focus:outline-none focus:border-primary dark:text-white"
              />
            </div>
          </div>

          {/* Task Table */}
          <div className="bg-surface rounded-[32px] border border-border overflow-hidden card-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-surface-light/50 dark:bg-white/5 border-b border-border dark:border-white/10">
                  <th className="py-5 pl-8">Task ID</th>
                  <th className="py-5">Title</th>
                  <th className="py-5">Candidate</th>
                  <th className="py-5">Status</th>
                  <th className="py-5">AI Score</th>
                  <th className="py-5 pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task, i) => (
                  <tr key={task.id} className={`group hover:bg-primary-light/20 transition-colors ${i === filtered.length - 1 ? '' : 'border-b border-border dark:border-white/10'}`}>
                    <td className="py-5 pl-8 text-xs font-bold text-text-muted">{task.id}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-light dark:bg-primary/10 rounded-lg flex items-center justify-center text-primary"><FileCode size={15} /></div>
                        <span className="text-sm font-bold text-text dark:text-white">{task.title}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="text-sm font-bold text-text-mid dark:text-white/80">{task.candidate}</div>
                      <div className="text-[10px] text-text-muted truncate max-w-[120px]">{task.fileName}</div>
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="py-5 font-serif font-bold text-lg text-primary">{task.score}</td>
                    <td className="py-5 pr-8 text-right">
                      {task.status === 'Assigned' && (
                        <button
                          onClick={() => handleEvaluate(task.candidateId)}
                          disabled={evaluating === task.candidateId}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${evaluating === task.candidateId ? 'bg-surface-light dark:bg-white/5 text-text-muted animate-pulse' : 'bg-primary-light dark:bg-primary/10 text-primary border-primary/10 hover:bg-primary hover:text-white'}`}
                        >
                          {evaluating === task.candidateId ? 'Evaluating...' : 'Auto-Evaluate'}
                        </button>
                      )}
                      {task.status === 'Evaluated' && (
                        <span className="text-[10px] font-black text-success flex items-center gap-1 justify-end"><CheckCircle2 size={14} /> Done</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-text-muted italic text-sm">
                       {candidates.length === 0 ? 'No candidates yet. Upload resumes first.' : 'No tasks found. Assign a task to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-8">
          <div className="bg-surface rounded-[32px] p-8 border border-border card-shadow">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2"><Zap className="text-primary" size={20} /> Pipeline Stats</h3>
            <div className="space-y-4">
              {[
                { l: 'Screened Candidates', v: candidates.length, c: 'text-primary' },
                { l: 'Tasks Assigned', v: tasks.filter(t => t.status !== 'Evaluated').length, c: 'text-warning' },
                { l: 'Tasks Evaluated', v: tasks.filter(t => t.status === 'Evaluated').length, c: 'text-success' },
              ].map(s => (
                <div key={s.l} className="flex justify-between items-center p-4 bg-surface-light dark:bg-white/5 rounded-2xl border border-border dark:border-white/10">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{s.l}</span>
                  <span className={`text-2xl font-serif font-bold ${s.c}`}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-[32px] p-8 border border-border card-shadow">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2"><Code className="text-primary" size={20} /> Task Library</h3>
            <div className="space-y-3">
              {TASK_LIBRARY.slice(0, 4).map((lib, i) => (
                <div key={i} className="p-4 border border-border rounded-2xl hover:bg-surface-light transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-text">{lib.title}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${diffColor(lib.difficulty)}`}>{lib.difficulty}</span>
                  </div>
                  <div className="text-[10px] text-text-muted">{lib.category}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-[32px] p-8 border border-border card-shadow">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2"><AlertCircle className="text-warning" size={20} /> Integrity Monitor</h3>
            <div className="space-y-3">
              <div className="p-4 bg-success-bg/40 dark:bg-success/5 rounded-2xl border border-success/10">
                <div className="text-[10px] font-black text-success uppercase tracking-widest mb-1">Environment Check</div>
                <div className="text-xs font-bold text-text dark:text-white">All active task containers are secure.</div>
              </div>
              {tasks.filter(t => t.status === 'Evaluated').map(t => (
                <div key={t.id} className="p-4 bg-primary-light dark:bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Score Updated</div>
                  <div className="text-xs font-bold text-text dark:text-white">{t.candidate}: Composite score recalculated.</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTask;
