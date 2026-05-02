import React, { useState, useEffect } from 'react';
import { Search, Bell, Info, CheckCircle, ChevronRight, Zap, Play, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';
import { createJob } from '../api/matchingApi';
import UserMenu from '../components/UserMenu';

function validateJobDescription(text) {
  const jd = text.toLowerCase().trim();

  if (jd.length < 300) {
    return {
      valid: false,
      score: 0,
      error: "Job description is too short. Please add role, responsibilities, skills, and experience."
    };
  }

  const requiredSignals = [
    "job title", "responsibilities", "requirements", "skills",
    "experience", "qualification", "role", "developer", "engineer"
  ];

  const fakeSignals = [
    "hello", "test", "random", "asdf", "lorem ipsum", "my name is", "chatgpt"
  ];

  const foundRequired = requiredSignals.filter(word => jd.includes(word));
  const foundFake = fakeSignals.filter(word => jd.includes(word));

  if (foundFake.length > 0 && foundRequired.length < 2) {
    return {
      valid: false,
      score: 0,
      error: "This does not look like a valid job description."
    };
  }

  if (foundRequired.length < 3) {
    return {
      valid: false,
      score: 25,
      error: "Job description is missing important sections like skills, responsibilities, or experience."
    };
  }

  let score = 0;
  if (jd.includes("responsibilities")) score += 20;
  if (jd.includes("requirements") || jd.includes("skills")) score += 25;
  if (jd.includes("experience")) score += 20;
  if (jd.includes("qualification") || jd.includes("education")) score += 10;
  if (jd.includes("role") || jd.includes("title")) score += 10;
  if (jd.length > 800) score += 15;

  return {
    valid: true,
    score: Math.min(score, 100),
    error: null
  };
}

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState('Senior');
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    experience: '',
    location: '',
    jd: ''
  });
  const [errors, setErrors] = useState({});
  const [jdError, setJdError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill job title if navigated from a role card on the dashboard
  useEffect(() => {
    if (location.state?.jobTitle) {
      setFormData(prev => ({ ...prev, title: location.state.jobTitle }));
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.experience || formData.experience <= 0) newErrors.experience = 'Valid experience is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.jd.trim() || formData.jd.length < 50) newErrors.jd = 'A detailed job description (min 50 chars) is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const result = validateJobDescription(formData.jd);
      if (!result.valid) {
        setJdError(result.error);
        return;
      }
      setJdError(null);
      setSubmitting(true);
      try {
        const job = await createJob({
          ...formData,
          level,
          experience: Number(formData.experience || 0),
        });

        const activeJobData = {
          title: formData.title || "Java Developer",
          description: formData.jd,
          jdScore: result.score,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("activeJob", JSON.stringify(activeJobData));

        MockDB.updateJD({
          ...formData,
          level,
          extraction: {
            competencies: job.skill_graph?.required || [],
            secondaryTraits: job.skill_graph?.inferred || [],
            exclusionRules: [],
            match: result.score,
          },
        });
        navigate('/analysis');
      } catch (err) {
        console.warn("Backend unavailable, falling back to local simulation:", err);
        // Local simulation fallback
        const activeJobData = {
          title: formData.title || "Java Developer",
          description: formData.jd,
          jdScore: result.score,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("activeJob", JSON.stringify(activeJobData));
        
        // Ensure subsequent screens have a job ID reference even in simulation mode
        const { setActiveJobId } = await import('../api/matchingApi');
        setActiveJobId(1);

        MockDB.updateJD({
          ...formData,
          level,
          extraction: {
            match: result.score,
          }
        });
        navigate('/analysis');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text dark:text-white mb-1 tracking-tight">Requirement Setup</h1>
          <p className="text-[10px] md:text-sm text-text-muted font-medium uppercase tracking-[0.2em]">Clinical Recruitment Pipeline</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border pt-6 md:pt-0">
          <div className="w-10 h-10 bg-white dark:bg-[#12122A] border border-border rounded-xl flex items-center justify-center text-text-mid cursor-pointer card-shadow hover:bg-surface-light transition-colors">
            <Bell size={20} />
          </div>
          <UserMenu user={MockDB.get().user} />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        <div className="w-full flex-1 bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-6 md:p-12 card-shadow border border-border">
          <div className="space-y-10 md:space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-xl shadow-primary/20 shrink-0">01</div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-text dark:text-white">Strategic Parameters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Position Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Lead System Architect" 
                    className={`w-full bg-surface-light dark:bg-[#1A1A35] border ${errors.title ? 'border-error' : 'border-border'} rounded-[20px] py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:text-text-muted/40 shadow-inner text-text dark:text-white`} 
                  />
                  {errors.title && <p className="text-[10px] text-error font-bold flex items-center gap-1.5 ml-1"><AlertCircle size={12} /> {errors.title}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-surface-light dark:bg-[#1A1A35] border border-border rounded-[20px] py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all appearance-none font-bold cursor-pointer shadow-inner text-text dark:text-white"
                  >
                    <option>Engineering</option>
                    <option>Product & Design</option>
                    <option>Operations</option>
                    <option>Growth & Marketing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 mb-8 md:mb-10">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block ml-1">Hierarchy level</label>
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {['Junior', 'Mid', 'Senior', 'Lead', 'Exec'].map(l => (
                    <button 
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`px-6 md:px-8 py-3 md:py-3.5 rounded-2xl text-[10px] md:text-[11px] font-black transition-all duration-300 border uppercase tracking-widest shrink-0 ${level === l ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105' : 'bg-white dark:bg-[#12122A] text-text-muted border-border hover:border-primary hover:text-primary'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Mandatory Experience (Years)</label>
                  <input 
                    type="number" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="e.g. 8" 
                    className={`w-full bg-surface-light dark:bg-[#1A1A35] border ${errors.experience ? 'border-error' : 'border-border'} rounded-[20px] py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all font-bold shadow-inner text-text dark:text-white`} 
                  />
                  {errors.experience && <p className="text-[10px] text-error font-bold flex items-center gap-1.5 ml-1"><AlertCircle size={12} /> {errors.experience}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Regional Scope</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Remote / HQ / EMEA" 
                    className={`w-full bg-surface-light dark:bg-[#1A1A35] border ${errors.location ? 'border-error' : 'border-border'} rounded-[20px] py-4 px-6 text-sm focus:outline-none focus:border-primary transition-all font-bold shadow-inner text-text dark:text-white`} 
                  />
                  {errors.location && <p className="text-[10px] text-error font-bold flex items-center gap-1.5 ml-1"><AlertCircle size={12} /> {errors.location}</p>}
                </div>
              </div>
            </section>

            <div className="h-px bg-border"></div>

            <section>
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-xl shadow-primary/20 shrink-0">02</div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-text dark:text-white">Job Description Content</h2>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block ml-1">Comprehensive Spec</label>
                <textarea 
                  value={formData.jd}
                  onChange={(e) => setFormData({...formData, jd: e.target.value})}
                  className={`w-full bg-surface-light dark:bg-[#1A1A35] border ${errors.jd ? 'border-error' : 'border-border'} rounded-[24px] md:rounded-[32px] py-6 md:py-8 px-6 md:px-10 text-sm focus:outline-none focus:border-primary transition-all h-64 md:h-80 font-sans leading-relaxed font-medium shadow-inner text-text dark:text-white`}
                  placeholder="Paste the full job specification here. AI will extract core competencies and semantic weights..."
                ></textarea>
                {errors.jd && <p className="text-[10px] text-error font-bold flex items-center gap-1.5 ml-1"><AlertCircle size={12} /> {errors.jd}</p>}
                {jdError && <p className="text-sm text-error font-bold flex items-center gap-1.5 ml-1 mt-3"><AlertCircle size={14} /> {jdError}</p>}
              </div>
            </section>

            <button
              disabled={submitting}
              onClick={handleSubmit} 
              className="w-full bg-primary text-white py-5 md:py-6 rounded-[20px] md:rounded-[24px] font-black text-lg md:text-xl shadow-2xl shadow-primary/40 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-4 active:scale-[0.98] mt-4 uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Analyzing..." : "Analyze Spec & Map Rules"} <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[420px] space-y-8">
          <div className="bg-white dark:bg-[#12122A] border border-border rounded-[32px] md:rounded-[40px] p-8 md:p-10 card-shadow">
            <h3 className="font-serif font-bold text-xl mb-8 text-text dark:text-white">Pipeline Stages</h3>
            <div className="space-y-8">
              {[
                { step: 1, title: 'Requirement Mapping', sub: "Extracting semantic weights from spec", status: 'current' },
                { step: 2, title: 'Bias-Blind Screening', sub: "AI scan with clinical extraction rules", status: 'next' },
                { step: 3, title: 'Candidate Shortlist', sub: "Ranked list based on weighted scoring", status: 'next' },
              ].map((s) => (
                <div key={s.step} className="flex gap-5 relative">
                   {s.step < 3 && <div className="absolute left-[15px] top-10 w-[2px] h-10 bg-border"></div>}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[12px] font-black z-10 ${s.status === 'current' ? 'bg-success text-white shadow-lg shadow-success/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                    {s.status === 'current' ? '✓' : s.step}
                  </div>
                  <div>
                    <div className={`text-sm font-black mb-1 ${s.status === 'current' ? 'text-text dark:text-white' : 'text-text-muted opacity-60'}`}>{s.title}</div>
                    <div className="text-[11px] text-text-muted font-bold leading-relaxed">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#10101A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={120} /></div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 text-primary"><Zap size={24} fill="currentColor" /></div>
                   <h3 className="font-serif font-bold text-xl">Accuracy Methods</h3>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed font-bold uppercase tracking-widest mb-10">
                   Proven Rule-Based Scoring Engine v4.2
                </p>
                <div className="space-y-6">
                   {[
                      { l: 'Extraction Precision', v: '99.8%' },
                      { l: 'Bias Detection Rate', v: '100%' },
                      { l: 'Semantic Coverage', v: '96.5%' },
                   ].map((stat) => (
                      <div key={stat.l} className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                            <span>{stat.l}</span>
                            <span>{stat.v}</span>
                         </div>
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full shadow-[0_0_8px_rgba(75,78,222,0.6)]"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Landing;
