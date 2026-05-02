import React, { useState } from 'react';
import { Play, BookOpen, Award, CheckCircle, Clock, Star, ChevronRight, BarChart3, Search } from 'lucide-react';

const Training = () => {
  const [activeTab, setActiveTab] = useState('Explore');
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ title: '', id: '' });
  const [showXpToast, setShowXpToast] = useState(false);

  const courses = [
    { title: 'Advanced Bias Recognition', progress: 100, lessons: 12, rating: 4.9, time: '2h 45m', status: 'Completed', color: 'bg-success', videoId: 'N-Z_TfC-H_w' },
    { title: 'Interviewer Ethics v2', progress: 45, lessons: 8, rating: 4.8, time: '1h 30m', status: 'In Progress', color: 'bg-primary', videoId: '6_rU9pBCHsM' },
    { title: 'Technical Assessment Mastery', progress: 0, lessons: 15, rating: 5.0, time: '4h 10m', status: 'Not Started', color: 'bg-border', videoId: 'nL6S0G_CInY' },
  ];

  const openVideo = (course) => {
    setCurrentVideo({ title: course.title, id: course.videoId });
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 4000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'My Learning':
        return (
          <div className="space-y-10">
            <h2 className="text-xl font-serif font-bold mb-6 text-text dark:text-white">In Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {courses.filter(c => c.status === 'In Progress').map((course, i) => (
                <div key={i} className="bg-surface border border-border rounded-[24px] p-6 md:p-8 card-shadow flex flex-col justify-between">
                   <div>
                      <h3 className="font-serif font-bold text-lg mb-2 text-text dark:text-white">{course.title}</h3>
                      <div className="w-full h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-text-muted">{course.progress}% Completed</span>
                   </div>
                   <button onClick={() => openVideo(course)} className="mt-6 w-full py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Resume Lesson</button>
                </div>
              ))}
            </div>
            {courses.filter(c => c.status === 'Completed').length > 0 && (
               <div className="mt-12">
                  <h2 className="text-xl font-serif font-bold mb-6 text-text dark:text-white">Completed</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {courses.filter(c => c.status === 'Completed').map((course, i) => (
                      <div key={i} className="bg-surface border border-border rounded-[24px] p-6 md:p-8 card-shadow flex flex-col justify-between opacity-80">
                        <h3 className="font-serif font-bold text-lg mb-2 text-text dark:text-white">{course.title}</h3>
                        <div className="flex items-center gap-2 text-success">
                           <CheckCircle size={14} /> <span className="text-[10px] font-bold uppercase">Certified</span>
                        </div>
                        <button onClick={() => openVideo(course)} className="mt-6 w-full py-3 rounded-xl border border-border text-text-mid font-bold text-xs uppercase tracking-widest hover:bg-surface-light transition-all">Review Course</button>
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        );
      case 'Certifications':
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-serif font-bold mb-6 text-text dark:text-white">Your Credentials</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: 'Technical Recruiter Pro', icon: '💎', date: 'Oct 2023', color: 'bg-primary/10' },
                { title: 'Diversity & Inclusion Expert', icon: '🌈', date: 'Jan 2024', color: 'bg-warning/10' },
                { title: 'Behavioral Science Level 1', icon: '🧠', date: 'Mar 2024', color: 'bg-success/10' },
                { title: 'HireWell System Mastery', icon: '⚔️', date: 'In Progress', color: 'bg-error/10', locked: true },
              ].map((cert, i) => (
                <div key={i} className={`bg-surface border border-border rounded-[24px] p-6 text-center card-shadow group cursor-pointer transition-all ${cert.locked ? 'grayscale opacity-50' : 'hover:bg-primary-light'}`}>
                  <div className={`w-16 h-16 ${cert.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>{cert.icon}</div>
                  <h3 className="text-sm font-bold text-text dark:text-white mb-1">{cert.title}</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{cert.locked ? 'Locked' : `Earned ${cert.date}`}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Leaderboard':
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-serif font-bold mb-6 text-text dark:text-white">Global Champions</h2>
            <div className="bg-surface border border-border rounded-[32px] overflow-hidden card-shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-light dark:bg-white/5 text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border">
                    <th className="py-5 pl-8">Rank</th>
                    <th className="py-5">Recruiter</th>
                    <th className="py-5">Efficiency</th>
                    <th className="py-5 pr-8 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Alex Rivera', points: '12,450', eff: '98%', img: 'a1' },
                    { name: 'Sarah Jenkins', points: '10,200', eff: '94%', img: 'a2' },
                    { name: 'You', points: '2,840', eff: '88%', img: 'a3', active: true },
                    { name: 'Michael Chen', points: '8,150', eff: '91%', img: 'a4' },
                  ].sort((a, b) => parseInt(b.points.replace(',','')) - parseInt(a.points.replace(',',''))).map((user, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 ${user.active ? 'bg-primary-light/40 dark:bg-primary/10' : 'hover:bg-surface-light/50 transition-colors'}`}>
                      <td className="py-5 pl-8">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-warning text-white shadow-lg shadow-warning/30' : 'text-text-muted'}`}>{i + 1}</div>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                           <img src={`https://i.pravatar.cc/100?u=${user.img}`} alt="avatar" className="w-8 h-8 rounded-full border border-border" />
                           <span className="text-sm font-bold text-text dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-5">
                         <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                               <div className="h-full bg-success" style={{ width: user.eff }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-text-mid">{user.eff}</span>
                         </div>
                      </td>
                      <td className="py-5 pr-8 text-right font-serif font-bold text-sm text-primary">{user.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default: // Explore
        return (
          <div className="space-y-10">
            {/* Continue Learning */}
            <section>
              <h2 className="text-xl font-serif font-bold mb-6 text-text dark:text-white">Continue Learning</h2>
              <div 
                onClick={() => openVideo({ title: 'Bias Mitigation in Tech Hiring', videoId: '6_rU9pBCHsM' })}
                className="bg-surface border border-border rounded-[24px] md:rounded-[40px] p-6 md:p-10 card-shadow flex flex-col md:flex-row gap-6 md:gap-10 items-center overflow-hidden relative group cursor-pointer hover:bg-primary-light/5 transition-all"
              >
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent"></div>
                  <div className="w-full md:w-48 h-32 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-primary/30 shrink-0 group-hover:scale-105 transition-transform">
                    <Play size={40} fill="currentColor" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest bg-primary-light dark:bg-white/5 px-3 py-1 rounded-full">Module 4</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-text-muted">15 mins left</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-text dark:text-white mb-4">Bias Mitigation in Tech Hiring</h3>
                    <div className="w-full h-2 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary w-[65%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] md:text-xs font-bold text-text-muted">65% Completed</span>
                        <button className="text-[11px] md:text-sm font-bold text-primary hover:underline flex items-center gap-1">Resume <ChevronRight size={16} /></button>
                    </div>
                  </div>
              </div>
            </section>

            {/* Featured Courses */}
            <section>
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-bold text-text dark:text-white">Featured Courses</h2>
                  <button className="text-[11px] md:text-xs font-bold text-primary">View All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {courses.map((course, i) => (
                    <div key={i} className="bg-surface border border-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 card-shadow hover:translate-y-[-4px] transition-all group">
                        <div className={`w-12 h-12 rounded-2xl ${course.color === 'bg-border' ? 'bg-surface-light dark:bg-white/5 text-text-muted' : 'bg-primary-light dark:bg-white/5 text-primary'} flex items-center justify-center mb-6`}>
                          <BookOpen size={24} />
                        </div>
                        <h3 className="font-serif font-bold text-lg mb-4 group-hover:text-primary transition-colors text-text dark:text-white">{course.title}</h3>
                        <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-6">
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {course.time}</span>
                          <span className="flex items-center gap-1.5"><Star size={12} className="text-warning fill-warning" /> {course.rating}</span>
                        </div>
                        <div className="pt-6 border-t border-border flex flex-wrap justify-between items-center gap-4">
                          <div className="flex -space-x-2">
                              {[1, 2, 3].map(j => (
                                <div key={j} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-[#12122A] overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?u=c${i}${j}`} alt="avatar" />
                                  </div>
                              ))}
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-[#12122A] bg-surface-light dark:bg-white/10 flex items-center justify-center text-[7px] md:text-[8px] font-black text-text-muted">+42</div>
                          </div>
                          <button 
                            onClick={() => openVideo(course)}
                            className={`px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-bold ${course.status === 'Completed' ? 'bg-success-bg text-success' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
                          >
                              {course.status === 'Completed' ? 'Recertify' : 'Start'}
                          </button>
                        </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text dark:text-white mb-1 tracking-tight">Training & Development</h1>
          <p className="text-xs md:text-sm text-text-muted">Enhance your recruitment skills with bias-blind methodology</p>
        </div>
        <div className="w-full md:w-auto">
           <div className="bg-surface border border-border rounded-xl px-5 md:px-6 py-3 flex items-center gap-3 card-shadow">
              <Award className="text-warning" size={20} />
              <div>
                 <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Your Points</div>
                 <div className="text-base md:text-lg font-serif font-bold text-text dark:text-white">2,840 XP</div>
              </div>
           </div>
        </div>
      </header>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
           <div className="bg-surface border border-white/20 rounded-[32px] md:rounded-[48px] w-full max-w-5xl overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="p-6 md:p-10 border-b border-border flex justify-between items-center">
                 <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-text dark:text-white">{currentVideo.title}</h2>
                    <p className="text-xs text-text-muted">HireWell Academy · Professional Certification</p>
                 </div>
                 <button 
                  onClick={closeVideo}
                  className="w-10 h-10 md:w-12 md:h-12 bg-surface-light dark:bg-white/5 border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-error transition-all"
                 >
                    <Star size={20} className="rotate-45" />
                 </button>
              </div>
              <div className="aspect-video w-full bg-black">
                 <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                 ></iframe>
              </div>
              <div className="p-6 md:p-10 bg-surface-light/50 dark:bg-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                       <Clock size={16} /> 24 mins remaining
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-success">
                       <Award size={16} /> Earn +150 XP
                    </div>
                 </div>
                 <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl border border-border font-bold text-sm text-text-mid dark:text-white">Full Screen</button>
                    <button onClick={closeVideo} className="flex-1 md:flex-none px-10 py-3.5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30">Next Lesson</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* XP Toast */}
      {showXpToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-success text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in-up">
           <Award size={24} />
           <div>
              <div className="text-xs font-black uppercase tracking-widest">Lesson Completed!</div>
              <div className="text-lg font-serif font-bold">+150 XP Awarded</div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-surface border border-border p-3 rounded-2xl mb-8 card-shadow gap-4">
              <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
                {['Explore', 'My Learning', 'Certifications', 'Leaderboard'].map(tab => (
                   <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-primary hover:bg-primary-light dark:hover:bg-white/5'}`}
                   >
                    {tab}
                   </button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                 <input type="text" placeholder="Search courses..." className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl py-2.5 pl-12 text-xs focus:outline-none focus:border-primary text-text dark:text-white" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-8">
          {renderContent()}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface rounded-[24px] md:rounded-[40px] p-6 md:p-10 border border-border card-shadow">
              <h3 className="font-serif font-bold text-lg md:text-xl mb-8 flex items-center gap-3 text-text dark:text-white">
                 <BarChart3 className="text-primary" size={24} /> Skill Profile
              </h3>
              <div className="space-y-8">
                 {[
                    { s: 'Bias Mitigation', v: 92 },
                    { s: 'Tech Screening', v: 78 },
                    { s: 'Behavioral Analysis', v: 85 },
                    { s: 'Experience', v: 96 },
                 ].map((skill, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                          <span>{skill.s}</span>
                          <span className="text-text dark:text-white font-black">{skill.v}%</span>
                       </div>
                       <div className="h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${skill.v}%` }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-warning rounded-[24px] md:rounded-[40px] p-8 md:p-10 text-white card-shadow shadow-warning/20">
              <h3 className="font-serif font-bold text-xl mb-4">Certified Expert</h3>
              <p className="text-white/80 text-[11px] md:text-xs leading-relaxed mb-8">
                 Top 3% of Recruiters globally. Complete "System Mastery" to unlock the Elite Badge.
              </p>
              <div className="bg-white/10 rounded-2xl p-4 md:p-6 border border-white/10 flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-warning shadow-xl">
                       <Award size={22} className="md:size-6" />
                    </div>
                    <div className="text-xs md:text-sm font-bold">Elite Shield</div>
                 </div>
                 <CheckCircle className="text-white/40" size={20} />
              </div>
              <button className="w-full bg-white text-warning py-3.5 md:py-4 rounded-[16px] md:rounded-[20px] font-bold text-xs md:text-sm shadow-xl active:scale-95 transition-all">Claim Elite Rewards</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
