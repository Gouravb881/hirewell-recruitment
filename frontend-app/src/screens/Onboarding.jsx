import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Users, Key, ChevronRight, Clock, Zap, UserPlus, Award, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';

const ONBOARDING_STEPS = [
  { id: 1, label: 'Documents', icon: FileText, tasks: ['ID Verification', 'Tax Forms (W-4)', 'NDA Signature', 'Employment Agreement'] },
  { id: 2, label: 'Team Intro', icon: Users, tasks: ['Meet Hiring Manager', 'Team Welcome Call', 'Buddy Assignment', 'Org Chart Review'] },
  { id: 3, label: 'System Access', icon: Key, tasks: ['GitHub Enterprise', 'Slack Workspace', 'Jira Software', 'Cloud Console'] },
  { id: 4, label: 'Welcome', icon: CheckCircle2, tasks: ['Welcome Kit Sent', 'Desk/Equipment Setup', 'First Day Schedule', 'Culture Handbook'] },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetId = location.state?.candidateId;
  
  const [candidates, setCandidates] = useState([]);
  const [activeCandIdx, setActiveCandIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showStartModal, setShowStartModal] = useState(false);
  const jd = MockDB.get().jd;

  const loadData = () => {
    const data = MockDB.get();
    // Show candidates who are eligible for onboarding
    const eligible = data.candidates.filter(c =>
      ['Screened', 'Task Done', 'Interviewed', 'Onboarding', 'Hired'].includes(c.stage)
    );
    setCandidates(eligible);
    
    if (targetId) {
      const idx = eligible.findIndex(c => c.id === targetId);
      if (idx !== -1) setActiveCandIdx(idx);
    }
  };

  useEffect(() => { loadData(); }, [targetId]);

  const activeCand = candidates[activeCandIdx];

  const handleStartOnboarding = (candidateId) => {
    MockDB.startOnboarding(candidateId);
    setShowStartModal(false);
    loadData();
  };

  const handleToggleTask = (stepId, taskIdx) => {
    if (!activeCand) return;
    const key = `${activeCand.id}-${stepId}-${taskIdx}`;
    setCompletedTasks(prev => {
      const next = { ...prev, [key]: !prev[key] };

      // Calculate overall progress
      let done = 0, total = 0;
      ONBOARDING_STEPS.forEach(step => {
        step.tasks.forEach((_, ti) => {
          total++;
          if (next[`${activeCand.id}-${step.id}-${ti}`]) done++;
        });
      });

      const progress = Math.round((done / total) * 100);
      const status = progress >= 100 ? 'Complete' : progress > 0 ? 'In Progress' : 'Not Started';
      MockDB.updateOnboarding(activeCand.id, progress, status);
      loadData();
      return next;
    });
  };

  const isTaskDone = (stepId, taskIdx) => {
    if (!activeCand) return false;
    return completedTasks[`${activeCand.id}-${stepId}-${taskIdx}`] || false;
  };

  const getStepProgress = (stepId) => {
    if (!activeCand) return 0;
    const step = ONBOARDING_STEPS.find(s => s.id === stepId);
    if (!step) return 0;
    const done = step.tasks.filter((_, i) => isTaskDone(stepId, i)).length;
    return Math.round((done / step.tasks.length) * 100);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text mb-1 tracking-tight">Onboarding Center</h1>
          <p className="text-xs md:text-sm text-text-muted">
            {candidates.filter(c => c.stage === 'Onboarding').length} active hires ·
            {candidates.filter(c => c.stage === 'Hired').length} completed · {jd?.title || 'All Roles'}
          </p>
        </div>
        <button
          onClick={() => setShowStartModal(true)}
          disabled={candidates.filter(c => !['Onboarding', 'Hired'].includes(c.stage)).length === 0}
          className="w-full md:w-auto bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <UserPlus size={18} /> Start Onboarding
        </button>
      </header>

      {/* Start Onboarding Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg card-shadow animate-fade-in-up">
            <h2 className="text-2xl font-serif font-bold mb-2">Start Onboarding</h2>
            <p className="text-sm text-text-muted mb-8">Select a screened candidate to begin their onboarding journey.</p>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-8" style={{ scrollbarWidth: 'none' }}>
              {candidates.filter(c => !['Onboarding', 'Hired'].includes(c.stage)).map(c => (
                <div
                  key={c.id}
                  onClick={() => handleStartOnboarding(c.id)}
                  className="p-5 rounded-2xl border border-border hover:border-primary cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm">#{c.id}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text group-hover:text-primary transition-colors">{c.name}</div>
                    <div className="text-[11px] text-text-muted">Score: {c.compositeScore || c.score} · Stage: {c.stage}</div>
                  </div>
                  <ArrowRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                </div>
              ))}
              {candidates.filter(c => !['Onboarding', 'Hired'].includes(c.stage)).length === 0 && (
                <div className="text-center py-10 text-text-muted italic text-sm">All eligible candidates are already onboarding.</div>
              )}
            </div>
            <button onClick={() => setShowStartModal(false)} className="w-full py-4 rounded-2xl border border-border text-text-mid font-bold hover:bg-surface-light transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 w-full">
          {/* Active Hire Selector + Card */}
          {candidates.filter(c => ['Onboarding', 'Hired'].includes(c.stage)).length > 0 ? (
            <>
              {/* Candidate Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {candidates.filter(c => ['Onboarding', 'Hired'].includes(c.stage)).map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCandIdx(candidates.indexOf(c))}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-xs md:text-sm shrink-0 transition-all whitespace-nowrap ${candidates.indexOf(c) === activeCandIdx ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-[#12122A] text-text-mid border-border hover:border-primary'}`}
                  >
                    <span className="font-black">#{c.id}</span>
                    <span className="text-[10px] md:text-[11px] opacity-80">{c.name}</span>
                    {c.stage === 'Hired' && <Award size={14} className="text-warning" />}
                  </button>
                ))}
              </div>

              {/* Active Card */}
                <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary-light dark:bg-white/5 flex items-center justify-center text-primary font-black text-lg md:text-xl shrink-0">
                        {activeCand.id}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg md:text-xl font-serif font-bold truncate">{activeCand.name}</h2>
                        <p className="text-[9px] md:text-[10px] text-text-muted font-bold uppercase tracking-widest truncate">
                          {jd?.level || 'Senior'} {jd?.title || 'Engineer'} · Score: {activeCand.compositeScore || activeCand.score}
                        </p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-2">
                      <div className={`text-[10px] md:text-sm font-black ${activeCand.onboardingProgress >= 100 ? 'text-success' : 'text-primary'}`}>
                        {activeCand.onboardingProgress}% Complete
                      </div>
                      <div className="w-full sm:w-48 h-2 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 rounded-full ${activeCand.onboardingProgress >= 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${activeCand.onboardingProgress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Step Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-10">
                    {ONBOARDING_STEPS.map((step) => {
                      const stepProg = getStepProgress(step.id);
                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveStep(step.id)}
                          className={`p-4 md:p-5 rounded-[16px] md:rounded-[24px] border transition-all flex flex-col items-center gap-2 md:gap-3 relative overflow-hidden ${activeStep === step.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : stepProg >= 100 ? 'bg-success-bg text-success border-success/20' : 'bg-surface-light dark:bg-white/5 text-text-mid border-border hover:bg-white'}`}
                        >
                          <step.icon size={20} className="md:size-[22px]" />
                          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{step.label}</span>
                          {stepProg > 0 && stepProg < 100 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
                              <div className="h-full bg-current opacity-30 transition-all" style={{ width: `${stepProg}%` }}></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Step Tasks */}
                  <div className="bg-surface-light dark:bg-white/5 rounded-[20px] md:rounded-[24px] p-6 md:p-8">
                    <h3 className="font-serif font-bold text-lg mb-6">{ONBOARDING_STEPS[activeStep - 1].label} Checklist</h3>
                    <div className="space-y-4">
                      {ONBOARDING_STEPS[activeStep - 1].tasks.map((task, i) => {
                        const done = isTaskDone(activeStep, i);
                        return (
                          <div
                            key={i}
                            onClick={() => handleToggleTask(activeStep, i)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${done ? 'bg-success-bg dark:bg-success/5 border-success/10' : 'bg-white dark:bg-[#12122A] border-border hover:border-primary/30'}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${done ? 'bg-success text-white' : 'border-2 border-border dark:border-white/10'}`}>
                              {done && <CheckCircle2 size={14} />}
                            </div>
                            <span className={`text-sm font-bold flex-1 ${done ? 'text-success line-through' : 'text-text dark:text-text-muted'}`}>{task}</span>
                            {done && <span className="text-[10px] font-black text-success uppercase">Done</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#12122A] rounded-[32px] p-10 md:p-16 border border-border card-shadow text-center">
              <div className="text-5xl md:text-6xl mb-6 opacity-20">📋</div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-text-muted mb-2">No Active Onboarding</h2>
              <p className="text-xs md:text-sm text-text-muted mb-8">Complete the screening pipeline first, then start onboarding.</p>
              <button onClick={() => navigate('/recruitment')} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/20">Go to Recruitment</button>
            </div>
          )}

          {/* All Hires Table */}
          {candidates.length > 0 && (
            <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] border border-border overflow-hidden card-shadow">
              <div className="p-6 md:p-8 border-b border-border flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg">Hires Pipeline</h3>
                <span className="text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">{candidates.length} Total</span>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-surface-light/50 dark:bg-white/5">
                      <th className="py-5 pl-8">ID</th>
                      <th className="py-5">File</th>
                      <th className="py-5">Stage</th>
                      <th className="py-5">Progress</th>
                      <th className="py-5">Status</th>
                      <th className="py-5 pr-8 text-right">Action</th>
                    </tr>
                  </thead>
                <tbody>
                  {candidates.map((c, i) => (
                    <tr key={c.id} className={`group hover:bg-primary-light/20 transition-colors ${i === candidates.length - 1 ? '' : 'border-b border-border'}`}>
                      <td className="py-5 pl-8 font-bold text-sm">#{c.id}</td>
                      <td className="py-5 text-sm font-medium text-text-mid truncate max-w-[150px]">{c.name}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.stage === 'Hired' ? 'bg-success-bg text-success' : c.stage === 'Onboarding' ? 'bg-primary-light text-primary' : 'bg-surface-light text-text-muted'}`}>
                          {c.stage}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 bg-surface-light rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${c.onboardingProgress >= 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${c.onboardingProgress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-text-muted">{c.onboardingProgress}%</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className={`text-[10px] font-black uppercase ${c.onboardingStatus === 'Complete' ? 'text-success' : c.onboardingStatus === 'In Progress' ? 'text-primary' : 'text-text-muted'}`}>
                          {c.onboardingStatus}
                        </span>
                      </td>
                      <td className="py-5 pr-8 text-right">
                        {!['Onboarding', 'Hired'].includes(c.stage) && (
                          <button
                            onClick={() => handleStartOnboarding(c.id)}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-primary-light text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all"
                          >
                            Start
                          </button>
                        )}
                        {c.stage === 'Onboarding' && (
                          <button
                            onClick={() => { setActiveCandIdx(candidates.indexOf(c)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="p-2 text-text-muted hover:text-primary transition-colors"
                          >
                            <ChevronRight size={18} />
                          </button>
                        )}
                        {c.stage === 'Hired' && <Award size={18} className="text-success inline-block" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-primary rounded-[32px] p-8 text-white card-shadow shadow-primary/20">
            <h3 className="font-serif font-bold text-xl mb-4">Pulse Analysis</h3>
            <p className="text-primary-light/80 text-xs leading-relaxed mb-8 italic">
              "Onboarding data is directly linked to recruitment pipeline results."
            </p>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary-light opacity-60 mb-1">Avg. Progress</div>
                <div className="text-2xl font-serif font-bold">
                  {candidates.filter(c => c.stage === 'Onboarding' || c.stage === 'Hired').length > 0
                    ? Math.round(candidates.filter(c => ['Onboarding', 'Hired'].includes(c.stage)).reduce((a, c) => a + c.onboardingProgress, 0) / candidates.filter(c => ['Onboarding', 'Hired'].includes(c.stage)).length)
                    : 0
                  }%
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary-light opacity-60 mb-1">Total Hired</div>
                <div className="text-2xl font-serif font-bold">{candidates.filter(c => c.stage === 'Hired').length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#12122A] rounded-[32px] p-8 border border-border card-shadow">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2"><Clock className="text-primary" size={20} /> Next Tasks</h3>
            <div className="space-y-4">
              {activeCand && activeCand.stage === 'Onboarding' ? (
                ONBOARDING_STEPS.flatMap(step =>
                  step.tasks.filter((_, i) => !isTaskDone(step.id, i)).slice(0, 1).map(task => ({ task, step: step.label }))
                ).slice(0, 3).map((item, i) => (
                  <div key={i} className="p-4 bg-surface-light dark:bg-white/5 rounded-2xl border border-border">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-text dark:text-white">{item.task}</span>
                      <span className="text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded bg-primary-light text-primary">{item.step}</span>
                    </div>
                    <div className="text-[10px] text-text-muted font-bold">For #{activeCand.id}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-muted italic text-xs md:text-sm">No active tasks.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
