import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, Video, MapPin, MoreVertical, X, Trash2 } from 'lucide-react';
import { MockDB } from '../utils/MockDatabase';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(24);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [newAppt, setNewAppt] = useState({ title: '', candidateId: 'A1', time: '10:00 AM', type: 'Video Call', duration: '45m' });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const data = MockDB.get();
    setAppointments(data.appointments || []);
  };

  const handleAdd = () => {
    MockDB.addAppointment({ ...newAppt, date: selectedDate });
    loadAppointments();
    setShowModal(false);
    setNewAppt({ title: '', candidateId: 'A1', time: '10:00 AM', type: 'Video Call', duration: '45m' });
  };

  const handleDelete = (id) => {
    MockDB.deleteAppointment(id);
    loadAppointments();
    setActiveDropdown(null);
  };

  const currentAppointments = appointments.filter(a => a.date === selectedDate);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text mb-1 tracking-tight">Appointment Manager</h1>
          <p className="text-xs md:text-sm text-text-muted">Coordinate and schedule interviews across the recruitment team</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none bg-white dark:bg-[#12122A] text-text-mid px-4 md:px-6 py-3 border border-border rounded-xl font-bold text-xs md:text-sm hover:bg-surface-light dark:hover:bg-white/5 transition-all">
             Sync Calendar
           </button>
           <button onClick={() => setShowModal(true)} className="flex-1 md:flex-none bg-primary text-white px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform hover:scale-105">
             <Plus size={18} /> <span className="hidden sm:inline">Schedule New</span><span className="sm:hidden">Schedule</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Side */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-border card-shadow h-fit w-full">
           <div className="flex justify-between items-center mb-8 md:mb-10">
              <h2 className="text-lg md:text-xl font-serif font-bold">May 2026</h2>
              <div className="flex gap-2">
                 <button className="w-8 h-8 md:w-10 md:h-10 bg-surface-light dark:bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-text-mid hover:bg-white dark:hover:bg-[#12122A] border border-border transition-all"><ChevronLeft size={18} /></button>
                 <button className="w-8 h-8 md:w-10 md:h-10 bg-surface-light dark:bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-text-mid hover:bg-white dark:hover:bg-[#12122A] border border-border transition-all"><ChevronRight size={18} /></button>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-y-4 md:gap-y-6 mb-8">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                 <div key={d} className="text-[8px] md:text-[10px] font-black text-text-muted text-center tracking-widest">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(n => {
                 const hasAppt = appointments.some(a => a.date === n);
                 return (
                 <button 
                  key={n}
                  onClick={() => setSelectedDate(n)}
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg md:rounded-2xl mx-auto flex items-center justify-center text-xs md:text-sm font-bold transition-all relative ${selectedDate === n ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10' : 'hover:bg-primary-light dark:hover:bg-white/5 hover:text-primary text-text-mid'}`}
                 >
                    {n}
                    {hasAppt && selectedDate !== n && (
                       <div className="absolute bottom-1.5 md:bottom-2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                 </button>
                 );
              })}
           </div>

           <div className="pt-8 border-t border-border">
              <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-6">Today's Reminders</div>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 bg-primary-light/40 dark:bg-[#EEF0FF05] p-4 rounded-2xl border border-primary/10">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shrink-0"><Clock size={20} /></div>
                    <div>
                       <div className="text-xs font-bold text-text">Interview Preparation</div>
                       <div className="text-[10px] text-primary font-bold">Starts in 15 Minutes</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Schedule Detail Side */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 w-full">
           <div className="bg-white dark:bg-[#12122A] rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-border card-shadow flex flex-col min-h-[500px] md:min-h-[600px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-light dark:bg-[#EEF0FF05] rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0"><CalendarIcon size={24} /></div>
                  <div>
                     <h3 className="font-serif font-bold text-lg md:text-xl">May {selectedDate} Schedule</h3>
                     <p className="text-[10px] md:text-xs text-text-muted font-bold">{currentAppointments.length} Meetings total</p>
                  </div>
               </div>
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-[#12122A] bg-surface-light dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-text-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                     </div>
                  ))}
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-[#12122A] bg-primary flex items-center justify-center text-[10px] font-black text-white">+2</div>
               </div>
            </div>

            <div className="flex-1 space-y-6">
               {currentAppointments.length === 0 ? (
                  <div className="text-center py-20">
                     <div className="text-4xl mb-4 opacity-20">📅</div>
                     <h4 className="text-lg font-serif font-bold text-text-muted">No appointments</h4>
                     <p className="text-sm text-text-muted">You have no scheduled meetings for this day.</p>
                  </div>
               ) : currentAppointments.map((apt) => (
                  <div key={apt.id} className="group flex gap-8 items-start relative p-6 rounded-[32px] hover:bg-surface-light/50 transition-all border border-transparent hover:border-border cursor-pointer">
                     <div className="w-20 pt-1">
                        <div className="text-sm font-black text-text-mid group-hover:text-primary transition-colors">{apt.time}</div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{apt.duration}</div>
                     </div>
                     
                     <div className="h-full w-px bg-border group-hover:bg-primary transition-colors"></div>

                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-2 relative">
                           <div>
                              <h4 className="text-md font-serif font-bold text-text group-hover:text-primary transition-colors">{apt.title}</h4>
                              <p className="text-xs font-bold text-text-mid">Candidate #{apt.candidateId}</p>
                           </div>
                           <button 
                              onClick={() => setActiveDropdown(activeDropdown === apt.id ? null : apt.id)}
                              className="text-text-muted hover:text-primary"
                           >
                              <MoreVertical size={18} />
                           </button>
                           {activeDropdown === apt.id && (
                              <div className="absolute right-0 top-6 bg-white border border-border shadow-xl rounded-xl py-2 w-32 z-10 animate-fade-in">
                                 <button onClick={() => handleDelete(apt.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-error hover:bg-error-bg flex items-center gap-2">
                                    <Trash2 size={14} /> Delete
                                 </button>
                              </div>
                           )}
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                           <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary-light px-3 py-1.5 rounded-full">
                              {apt.type === 'Video Call' ? <Video size={12} /> : <MapPin size={12} />}
                              {apt.type}
                           </div>
                           {apt.type === 'Video Call' && (
                              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                 Join Link <ChevronRight size={10} />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <button onClick={() => setShowModal(true)} className="w-full mt-10 py-5 bg-surface-light border border-dashed border-border rounded-[24px] text-text-muted font-bold text-sm hover:bg-white hover:border-primary hover:text-primary transition-all">
               + Add Event
            </button>
           </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
           <div className="bg-white dark:bg-[#12122A] rounded-[32px] p-6 md:p-8 max-w-md w-full animate-fade-in-up border border-border">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-serif font-bold text-text">New Appointment</h2>
                 <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Meeting Title</label>
                    <input type="text" value={newAppt.title} onChange={e => setNewAppt({...newAppt, title: e.target.value})} placeholder="e.g. Technical Round" className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary dark:text-white" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Candidate ID</label>
                    <input type="text" value={newAppt.candidateId} onChange={e => setNewAppt({...newAppt, candidateId: e.target.value})} placeholder="e.g. A1" className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary dark:text-white" />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Start Time</label>
                       <input type="text" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} placeholder="10:00 AM" className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary dark:text-white" />
                    </div>
                    <div className="flex-1">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Duration</label>
                       <input type="text" value={newAppt.duration} onChange={e => setNewAppt({...newAppt, duration: e.target.value})} placeholder="45m" className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary dark:text-white" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Location / Type</label>
                    <select value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})} className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary dark:text-white">
                       <option value="Video Call">Video Call</option>
                       <option value="In-Person">In-Person</option>
                       <option value="Meeting">Meeting</option>
                    </select>
                 </div>
                 <button onClick={handleAdd} className="w-full bg-primary text-white font-black py-4 rounded-xl mt-4 hover:opacity-90 shadow-lg shadow-primary/30 uppercase tracking-widest text-xs">Save Appointment</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
