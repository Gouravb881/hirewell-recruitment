import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Bell, Download, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';
import { getActiveJobId, listCandidates, listMatches } from '../api/matchingApi';
import UserMenu from '../components/UserMenu';

const RadarChart = ({ data = {} }) => {
  // Default points if data is missing
  const points = {
    technical: data.technical || 85,
    comm: data.communication || 70,
    exp: data.experience || 90,
    alignment: data.alignment || 65,
    growth: data.growth || 80,
    culture: data.culture || 75
  };

  const getPoint = (val, angle) => {
    const r = (val / 100) * 50;
    const rad = (angle - 90) * (Math.PI / 180);
    return `${50 + r * Math.cos(rad)},${50 + r * Math.sin(rad)}`;
  };

  const polyPoints = [
    getPoint(points.technical, 0),
    getPoint(points.comm, 60),
    getPoint(points.exp, 120),
    getPoint(points.alignment, 180),
    getPoint(points.growth, 240),
    getPoint(points.culture, 300)
  ].join(' ');

  return (
    <div className="relative w-48 h-48 sm:w-72 sm:h-72 mx-auto my-8 md:my-12 animate-fade-in-up">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Web grid */}
        {[20, 40, 60, 80, 100].map(r => (
          <polygon 
            key={r}
            points={`
              50,${50-r/2} 
              ${50+r*0.43},${50-r*0.25} 
              ${50+r*0.43},${50+r*0.25} 
              50,${50+r/2} 
              ${50-r*0.43},${50+r*0.25} 
              ${50-r*0.43},${50-r*0.25}
            `}
            fill="none" 
            stroke="#EEEEF8" 
            strokeWidth="0.5"
            className="dark:stroke-white/10"
          />
        ))}
        {/* Axes */}
        <line x1="50" y1="50" x2="50" y2="0" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        <line x1="50" y1="50" x2="93.3" y2="25" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        <line x1="50" y1="50" x2="93.3" y2="75" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        <line x1="50" y1="50" x2="50" y2="100" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        <line x1="50" y1="50" x2="6.7" y2="75" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        <line x1="50" y1="50" x2="6.7" y2="25" stroke="#EEEEF8" strokeWidth="0.5" className="dark:stroke-white/10" />
        
        {/* Data Polygon */}
        <polygon 
          points={polyPoints}
          fill="rgba(75, 78, 222, 0.15)" 
          stroke="#4B4EDE" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Points */}
        {polyPoints.split(' ').map((p, i) => (
          <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r="2.5" fill="white" stroke="#4B4EDE" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute top-[-20px] sm:top-[-30px] left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Technical</div>
      <div className="absolute top-[20%] right-[-30px] sm:right-[-50px] text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Comm.</div>
      <div className="absolute bottom-[20%] right-[-20px] sm:right-[-30px] text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Exp.</div>
      <div className="absolute bottom-[-20px] sm:bottom-[-30px] left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Alignment</div>
      <div className="absolute bottom-[20%] left-[-20px] sm:left-[-30px] text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Growth</div>
      <div className="absolute top-[20%] left-[-30px] sm:left-[-50px] text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Culture</div>
    </div>
  );
};

const CandidateScorecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const candidateId = location.state?.candidateId;
  const [candidate, setCandidate] = useState(null);
  const [match, setMatch] = useState(null);
  const [jd, setJd] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = MockDB.get();
    setJd(data.jd);
    setUser(data.user);
    const jobId = getActiveJobId();
    if (!jobId) return;
    Promise.all([listCandidates(jobId), listMatches(jobId)])
      .then(([cands, matches]) => {
        const selected = candidateId ? cands.find((c) => String(c.id) === String(candidateId)) : cands[0];
        setCandidate(selected || null);
        if (selected) setMatch(matches.find((m) => String(m.candidate_id) === String(selected.id)) || null);
      })
      .catch((err) => {
        console.warn("Backend unavailable, using MockDB for scorecard:", err);
        const candList = data.candidates || [];
        const selected = candidateId ? candList.find((c) => String(c.id) === String(candidateId)) : candList[0];
        setCandidate(selected || null);
        
        // Try to get match results from localStorage cache first
        const savedResults = localStorage.getItem("screeningResults");
        if (savedResults && selected) {
          const matches = JSON.parse(savedResults);
          setMatch(matches.find((m) => String(m.candidate_id) === String(selected.id)) || null);
        } else if (selected) {
          // Final fallback: local status check
          setMatch({
            final_score: selected.score || 0,
            decision: selected.status || 'Review',
            confidence_score: 95,
            confidence_label: 'High'
          });
        }
      });
  }, [candidateId]);

  if (!candidate) return <div className="p-10">Loading candidate data...</div>;

  const score = Number(match?.final_score || 0);
  const recLabel = score >= 85 ? 'Strongly Recommend' : score >= 65 ? 'Recommend' : 'Hold';
  const recColor = score >= 85 ? 'text-success bg-success-bg border-success/10' : score >= 65 ? 'text-primary bg-primary-light border-primary/10' : 'text-warning bg-warning-bg border-warning/10';

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up">
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-1">
             <h1 className="text-2xl md:text-3xl font-serif font-bold text-text">Candidate #{candidate.id}</h1>
             <span className={`${recColor} px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border`}>{recLabel}</span>
          </div>
          <p className="text-xs md:text-sm text-text-muted">{jd?.title || 'Applied Position'} · Explainable Assessment Scorecard</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border pt-6 md:pt-0">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-white dark:bg-[#12122A] border border-border rounded-xl flex items-center justify-center text-text-mid cursor-pointer card-shadow"><Share2 size={18} /></button>
            <button className="w-10 h-10 bg-white dark:bg-[#12122A] border border-border rounded-xl flex items-center justify-center text-text-mid cursor-pointer card-shadow"><Bell size={20} /></button>
          </div>
          <UserMenu user={user} />
        </div>
      </header>
 
       <div className="flex flex-col lg:flex-row gap-8 pb-10">
        {/* Left Side */}
        <div className="flex-1 space-y-6 md:space-y-8">
           {/* Composite Score Card */}
 
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow">
                 <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} /> Green Flags
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <div className="text-sm font-bold text-text mb-2">Advanced Design Systems</div>
                       <p className="text-xs text-text-mid leading-relaxed italic">"Candidate built and scaled a multi-platform design system in Figma for 200+ designers."</p>
                    </div>
                    <div>
                       <div className="text-sm font-bold text-text mb-2">WCAG Accessibility Expert</div>
                       <p className="text-xs text-text-mid leading-relaxed italic">"Expert-level knowledge of accessible design patterns and inclusive UX research."</p>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white dark:bg-[#12122A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow">
                 <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3">
                    <XCircle className="text-error" size={20} /> Red Flags
                 </h3>
                 <div className="space-y-6">
                    <div className="bg-error-bg dark:bg-[#FFEBEE05] p-5 rounded-2xl border border-error/10">
                       <div className="text-sm font-bold text-error mb-2">Role Domain Mismatch</div>
                       <p className="text-[11px] text-error/70 leading-relaxed italic">"Candidate background is heavily focused on Print Management rather than Digital Product Design."</p>
                    </div>
                 </div>
              </div>
           </div>
            <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-border card-shadow">
               <h3 className="font-serif font-bold text-xl mb-6">Recruiter Brief</h3>
               <div className="space-y-6 md:space-y-8 font-sans text-sm text-text-mid leading-relaxed">
                  <p><strong className="text-text dark:text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest mr-2">Summary:</strong> Candidate #{candidate.id} is a {recLabel.toLowerCase()} candidate for the {jd?.title || 'position'}. They matched {score}% of weighted requirements.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                    <div>
                       <div className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-4">Strengths</div>
                       <ul className="space-y-3 list-disc pl-4 text-[11px] md:text-xs font-bold dark:text-text-muted">
                          <li>Expert Figma component management.</li>
                          <li>Strong user research methodology.</li>
                          <li>Proactive design-level thinking.</li>
                       </ul>
                    </div>
                    <div>
                       <div className="text-[9px] md:text-[10px] font-black text-error uppercase tracking-widest mb-4">Concerns</div>
                       <ul className="space-y-3 list-disc pl-4 text-[11px] md:text-xs font-bold dark:text-text-muted">
                          <li>Significant lack of digital design portfolio.</li>
                       </ul>
                    </div>
                 </div>
                 <div className="bg-surface-light dark:bg-white/5 p-5 md:p-6 rounded-[20px] md:rounded-[24px] border border-border">
                    <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Suggested Next Step</div>
                    <p className="text-xs md:text-sm font-bold text-text dark:text-white italic">"Proceed to portfolio review with Design Director focusing on design system scalability."</p>
                 </div>
              </div>
            </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[400px] xl:w-[450px] space-y-6 md:space-y-8 flex flex-col shrink-0">
           <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-border card-shadow flex flex-col items-center">
              <h3 className="font-serif font-bold text-lg md:text-xl self-start">Dimension Breakdown</h3>
              <RadarChart data={match?.dimensions} />
               <div className="w-full space-y-4 pt-4 border-t border-border">
                  {[
                     { l: 'Final Score', v: score || '—', c: 'bg-primary' },
                     { l: 'Decision', v: match?.decision || '—', c: 'bg-primary' },
                     { l: 'Confidence', v: match?.confidence_score || '—', c: 'bg-success' },
                     { l: 'Status', v: match?.confidence_label || '—', c: 'bg-primary' },
                  ].map(d => (
                     <div key={d.l} className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{d.l}</span>
                        <span className="text-sm font-black text-text">{d.v}</span>
                     </div>
                  ))}
               </div>
           </div>

            <div className="space-y-4 mt-auto">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <button
                    onClick={() => {
                      MockDB.updateCandidateStatus(candidate.id, 'Rejected');
                      navigate('/shortlist');
                    }}
                    className="bg-error-bg text-error py-4 rounded-[20px] font-bold text-[10px] border border-error/10 hover:bg-error hover:text-white transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      MockDB.updateCandidateStatus(candidate.id, 'Hold');
                      navigate('/shortlist');
                    }}
                    className="bg-warning-bg text-warning py-4 rounded-[20px] font-bold text-[10px] border border-warning/10 hover:bg-warning hover:text-white transition-all"
                  >
                    Hold
                  </button>
                  <button
                    onClick={() => {
                      MockDB.updateCandidateStatus(candidate.id, 'Review');
                      navigate('/shortlist');
                    }}
                    className="bg-primary-light text-primary py-4 rounded-[20px] font-bold text-[10px] border border-primary/10 hover:bg-primary hover:text-white transition-all"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => {
                      MockDB.updateCandidateStatus(candidate.id, 'Shortlist');
                      navigate('/shortlist');
                    }}
                    className="bg-success-bg text-success py-4 rounded-[20px] font-bold text-[10px] border border-success/10 hover:bg-success hover:text-white transition-all"
                  >
                    Shortlist
                  </button>
                </div>
               <button 
                 onClick={() => {
                   MockDB.startOnboarding(candidate.id);
                   navigate('/onboarding', { state: { candidateId: candidate.id } });
                 }} 
                 className="w-full bg-primary text-white py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-bold text-base md:text-lg shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-widest"
               >
                 {recLabel === 'Strongly Recommend' ? 'Hire Candidate' : 'Move to Onboarding'} <ChevronRight size={20} />
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateScorecard;
