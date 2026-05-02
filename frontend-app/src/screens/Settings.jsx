import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, ShieldCheck, Settings as SettingsIcon, ChevronRight, User, Mail, Briefcase } from 'lucide-react';
import { MockDB } from '../utils/MockDatabase';

const Toggle = ({ enabled, onClick, label }) => (
  <div className="flex items-center justify-between py-5 border-b border-border last:border-0">
    <div className="flex flex-col">
      <span className="text-sm font-bold text-text">{label}</span>
      {label.includes('nationality') && <span className="text-[10px] text-text-muted font-bold mt-1">Disable only for location-required roles</span>}
    </div>
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${enabled ? 'bg-primary' : 'bg-border'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

const WeightSlider = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
      <span>{label}</span>
      <span className="text-primary bg-primary-light px-2 py-0.5 rounded-lg">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full accent-primary bg-surface-light h-1.5 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
);

const SettingsScreen = () => {
  const [anonymization, setAnonymization] = useState({
    name: true,
    institution: true,
    gradYear: true,
    gender: true,
    location: true,
    links: true,
    photo: true
  });

  const [weights, setWeights] = useState({
    technical: 40,
    communication: 20,
    experience: 15,
    alignment: 10,
    trajectory: 10,
    culture: 5
  });

  const [interview, setInterview] = useState({
    techQ: 4,
    behavQ: 3,
    redFlags: true
  });

  const [user, setUser] = useState({ name: '', role: '', email: '' });

  useEffect(() => {
    const data = MockDB.get();
    if (data.user) setUser(data.user);
  }, []);

  const handleSave = () => {
    MockDB.updateUser(user);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text dark:text-white mb-1 tracking-tight">Bias Shield Settings</h1>
          <p className="text-[10px] md:text-sm text-text-muted uppercase tracking-[0.2em] font-bold">Global Configuration Panel</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 text-xs md:text-sm font-bold text-text-muted hover:text-text dark:hover:text-white flex items-center justify-center gap-2 bg-white dark:bg-[#12122A] border border-border rounded-xl card-shadow transition-all">
            <RefreshCw size={16} /> Reset
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 md:flex-none px-8 py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all text-xs md:text-sm"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <div className="space-y-8 md:space-y-10">
          <section className="bg-white dark:bg-[#12122A] border border-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 card-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                 <User size={20} />
              </div>
              <h2 className="font-serif text-xl font-bold text-text dark:text-white">User Profile</h2>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                     <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                     <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-2xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none font-bold text-text dark:text-white" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Job Role</label>
                  <div className="relative">
                     <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                     <input type="text" value={user.role} onChange={e => setUser({...user, role: e.target.value})} className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-2xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none font-bold text-text dark:text-white" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                     <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                     <input type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-2xl py-3 pl-10 pr-4 text-sm focus:border-primary outline-none font-bold text-text dark:text-white" />
                  </div>
               </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#12122A] border border-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 card-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary-light dark:bg-white/5 rounded-xl flex items-center justify-center text-primary">
                 <ShieldCheck size={20} />
              </div>
              <h2 className="font-serif text-xl font-bold text-text dark:text-white">Anonymization Rules</h2>
            </div>
            <div className="space-y-1">
              <Toggle label="Remove candidate name" enabled={anonymization.name} onClick={() => setAnonymization(p => ({...p, name: !p.name}))} />
              <Toggle label="Remove institution name" enabled={anonymization.institution} onClick={() => setAnonymization(p => ({...p, institution: !p.institution}))} />
              <Toggle label="Remove graduation year" enabled={anonymization.gradYear} onClick={() => setAnonymization(p => ({...p, gradYear: !p.gradYear}))} />
              <Toggle label="Remove gender pronouns" enabled={anonymization.gender} onClick={() => setAnonymization(p => ({...p, gender: !p.gender}))} />
              <Toggle label="Remove location" enabled={anonymization.location} onClick={() => setAnonymization(p => ({...p, location: !p.location}))} />
              <Toggle label="Remove social URLs" enabled={anonymization.links} onClick={() => setAnonymization(p => ({...p, links: !p.links}))} />
              <Toggle label="Remove profile photo" enabled={anonymization.photo} onClick={() => setAnonymization(p => ({...p, photo: !p.photo}))} />
            </div>
          </section>
        </div>

        <div className="space-y-8 md:space-y-10">
          <section className="bg-white dark:bg-[#12122A] border border-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 card-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary-light dark:bg-white/5 rounded-xl flex items-center justify-center text-primary">
                 <RefreshCw size={20} />
              </div>
              <h2 className="font-serif text-xl font-bold text-text dark:text-white">Scoring Weights</h2>
            </div>
            <div className="space-y-8">
              <WeightSlider label="Technical Fit" value={weights.technical} onChange={(v) => setWeights(p => ({...p, technical: v}))} />
              <WeightSlider label="Communication" value={weights.communication} onChange={(v) => setWeights(p => ({...p, communication: v}))} />
              <WeightSlider label="Experience" value={weights.experience} onChange={(v) => setWeights(p => ({...p, experience: v}))} />
              <WeightSlider label="Role Alignment" value={weights.alignment} onChange={(v) => setWeights(p => ({...p, alignment: v}))} />
              <WeightSlider label="Growth Track" value={weights.trajectory} onChange={(v) => setWeights(p => ({...p, trajectory: v}))} />
              <WeightSlider label="Culture Signal" value={weights.culture} onChange={(v) => setWeights(p => ({...p, culture: v}))} />
              
              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-text-muted">Total Sum</span>
                  <span className={`px-4 py-1.5 rounded-lg border ${Object.values(weights).reduce((a,b)=>a+b,0) === 100 ? 'text-success bg-success-bg dark:bg-success/10 border-success/10' : 'text-error bg-error-bg dark:bg-error/10 border-error/10'}`}>
                    {Object.values(weights).reduce((a,b)=>a+b,0)}% / 100%
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#12122A] border border-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 card-shadow">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 bg-primary-light dark:bg-white/5 rounded-xl flex items-center justify-center text-primary">
                 <SettingsIcon size={20} />
              </div>
              <h2 className="font-serif text-xl font-bold text-text dark:text-white">Interview Config</h2>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text dark:text-text-muted">Technical Q's</span>
                <div className="flex items-center bg-surface-light dark:bg-white/5 rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setInterview(p => ({...p, techQ: Math.max(2, p.techQ - 1)}))} className="px-4 py-2 hover:bg-white dark:hover:bg-white/10 hover:text-primary transition-all font-black text-text dark:text-white">-</button>
                  <span className="px-5 py-2 font-black text-sm border-x border-border bg-white dark:bg-[#12122A] text-primary">{interview.techQ}</span>
                  <button onClick={() => setInterview(p => ({...p, techQ: Math.min(8, p.techQ + 1)}))} className="px-4 py-2 hover:bg-white dark:hover:bg-white/10 hover:text-primary transition-all font-black text-text dark:text-white">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text dark:text-text-muted">Behavioral Q's</span>
                <div className="flex items-center bg-surface-light dark:bg-white/5 rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setInterview(p => ({...p, behavQ: Math.max(1, p.behavQ - 1)}))} className="px-4 py-2 hover:bg-white dark:hover:bg-white/10 hover:text-primary transition-all font-black text-text dark:text-white">-</button>
                  <span className="px-5 py-2 font-black text-sm border-x border-border bg-white dark:bg-[#12122A] text-primary">{interview.behavQ}</span>
                  <button onClick={() => setInterview(p => ({...p, behavQ: Math.min(5, p.behavQ + 1)}))} className="px-4 py-2 hover:bg-white dark:hover:bg-white/10 hover:text-primary transition-all font-black text-text dark:text-white">+</button>
                </div>
              </div>
              
              <div className="mt-4 p-6 bg-primary-light dark:bg-white/5 rounded-3xl border border-primary/10">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Estimated Duration</div>
                <div className="text-3xl font-serif font-bold text-primary">{(interview.techQ * 8) + (interview.behavQ * 5)} <span className="text-xs text-primary/60 font-black uppercase tracking-widest ml-1">min</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
