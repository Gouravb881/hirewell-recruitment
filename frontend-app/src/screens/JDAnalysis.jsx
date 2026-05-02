import React, { useEffect, useState } from 'react';
import { Target, Star, Clock, Lightbulb, Zap, ShieldAlert, Users, Upload, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';

const JDAnalysis = () => {
  const navigate = useNavigate();
  const [jdData, setJdData] = useState(null);

  useEffect(() => {
    const data = MockDB.get();
    if (data.jd) {
      setJdData(data.jd);
    } else {
      setJdData({ 
        title: 'Senior ML Engineer', 
        level: 'Senior', 
        experience: '5', 
        department: 'Engineering', 
        jd: 'Analyzing spec...',
        extraction: {
          match: null,
          competencies: ['Python', 'System Design', 'Cloud Architecture', 'Leadership', 'Strategic Planning', 'Agile Delivery', 'Problem Solving'],
          secondaryTraits: ['Public Speaking', 'Mentorship', 'Open Source', 'Cross-functional', 'EMEA Experience'],
          exclusionRules: ['Contract Only', 'No Cloud Exp', 'Relocation Only', 'Bi-weekly Shift']
        }
      });
    }
  }, []);

  if (!jdData) return null;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up">

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-text">Requirements Map</h1>
             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10 shrink-0">Extraction v4.2</span>
           </div>
           <p className="text-xs md:text-sm text-text-muted font-bold uppercase tracking-widest">{jdData.title} · {jdData.department} · {jdData.experience}+ Years</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-white dark:bg-[#12122A] border border-border p-2 rounded-2xl shadow-sm w-full lg:w-auto">
           <div className="flex items-center gap-2 bg-success text-white px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black shadow-lg shadow-success/20">
              <CheckCircle2 size={16} /> <span className="hidden sm:inline">SETUP</span>
           </div>
           <div className="w-4 md:w-8 h-[2px] bg-success/20"></div>
           <div className="flex items-center gap-2 bg-primary text-white px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black shadow-lg shadow-primary/20">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">2</div> <span className="hidden sm:inline">ANALYSIS</span>
           </div>
           <div className="w-4 md:w-8 h-[2px] bg-border"></div>
           <div className="text-text-muted px-2 md:px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">3 <span className="hidden sm:inline">UPLOAD</span></div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow group hover:border-primary transition-all text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-light dark:bg-[#EEF0FF10] text-primary rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-3xl md:text-5xl font-serif font-bold text-text mb-1">{jdData.extraction?.match !== null && jdData.extraction?.match !== undefined ? `${jdData.extraction.match}%` : '--%'}</div>
          <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Extraction Match</div>
        </div>
        <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow group hover:border-primary transition-all text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-success-bg dark:bg-[#E8F5E910] text-success rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-3xl md:text-5xl font-serif font-bold text-text mb-1">{jdData.level}</div>
          <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Hierarchy Level</div>
        </div>
        <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow group hover:border-primary transition-all text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-warning-bg dark:bg-[#FFF4ED10] text-warning rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-3xl md:text-5xl font-serif font-bold text-text mb-1">{jdData.experience}yr</div>
          <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mandatory Exp.</div>
        </div>
        <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow group hover:border-primary transition-all text-center md:text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-error-bg dark:bg-[#FFEBEE10] text-error rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-3xl md:text-5xl font-serif font-bold text-text mb-1">{jdData.extraction?.competencies?.length || 12}</div>
          <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Competencies</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-4 bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-border card-shadow flex flex-col h-auto lg:h-[750px]">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
             <div className="w-10 h-10 bg-surface-light dark:bg-[#1A1A35] rounded-2xl flex items-center justify-center text-xl shadow-inner shrink-0">📄</div>
             <h3 className="font-serif font-bold text-xl md:text-2xl">Original Spec</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto font-sans text-xs md:text-sm text-text-mid leading-[2] space-y-6 lg:pr-6 custom-scrollbar scroll-smooth">
            <div className="p-4 md:p-6 bg-surface-light/50 dark:bg-white/5 rounded-2xl md:rounded-3xl border border-border italic relative">
               <div className="absolute top-4 right-4 opacity-10 text-primary pointer-events-none"><Zap size={40} fill="currentColor" /></div>
               {jdData.jd || "No job description provided."}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border flex items-center justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">
             <span>v4.2 Neural Mapping</span>
             <span className="text-success">Verified Secure</span>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-border card-shadow relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-success group-hover:opacity-10 transition-opacity pointer-events-none"><Zap size={100} fill="currentColor" /></div>
                 <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 bg-success-bg dark:bg-[#E8F5E910] text-success rounded-2xl flex items-center justify-center shadow-lg shadow-success/10 shrink-0"><CheckCircle2 size={20} /></div>
                    <h3 className="font-serif font-bold text-lg md:text-xl">Core Competencies</h3>
                 </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(jdData.extraction?.competencies || ['Python', 'System Design', 'Cloud Architecture', 'Leadership', 'Strategic Planning', 'Agile Delivery', 'Problem Solving']).map(s => (
                       <span key={s} className="bg-success-bg dark:bg-[#E8F5E910] text-success border border-success/20 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">{s}</span>
                    ))}
                  </div>
              </div>

              <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-border card-shadow relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-primary group-hover:opacity-10 transition-opacity pointer-events-none"><Lightbulb size={100} fill="currentColor" /></div>
                 <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 bg-primary-light dark:bg-[#EEF0FF10] text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 shrink-0"><Lightbulb size={20} /></div>
                    <h3 className="font-serif font-bold text-lg md:text-xl">Secondary Traits</h3>
                 </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(jdData.extraction?.secondaryTraits || ['Public Speaking', 'Mentorship', 'Open Source', 'Cross-functional', 'EMEA Experience']).map(s => (
                       <span key={s} className="bg-primary-light dark:bg-[#EEF0FF10] text-primary border border-primary/20 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">{s}</span>
                    ))}
                  </div>
              </div>

              <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-border card-shadow relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-error group-hover:opacity-10 transition-opacity pointer-events-none"><ShieldAlert size={100} fill="currentColor" /></div>
                 <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 bg-error-bg dark:bg-[#FFEBEE10] text-error rounded-2xl flex items-center justify-center shadow-lg shadow-error/10 shrink-0"><ShieldAlert size={20} /></div>
                    <h3 className="font-serif font-bold text-lg md:text-xl">Exclusion Rules</h3>
                 </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(jdData.extraction?.exclusionRules || ['Contract Only', 'No Cloud Exp', 'Relocation Only', 'Bi-weekly Shift']).map(s => (
                       <span key={s} className="bg-error-bg dark:bg-[#FFEBEE10] text-error border border-error/20 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">{s}</span>
                    ))}
                  </div>
              </div>

              <div className="bg-[#10101A] rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-center min-h-[280px]">
                 <h3 className="font-serif font-bold text-xl md:text-2xl mb-4">Ready to Screen?</h3>
                  <p className="text-xs md:text-sm text-white/50 leading-relaxed mb-8">
                    AI has mapped {jdData.extraction?.competencies?.length || 12} unique semantic dimensions based on your spec. Proceed to upload resumes for clinical scoring.
                  </p>
                 <button 
                  onClick={() => navigate('/upload')} 
                  className="w-full bg-primary text-white py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-base md:text-lg shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase tracking-widest"
                 >
                   Initiate Upload <Upload size={22} />
                 </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default JDAnalysis;
