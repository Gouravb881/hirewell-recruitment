import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle, Flag, ArrowRight, Mic, MicOff, Bell, Timer, Brain, MessageSquare, Zap, Type, StopCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockDB } from '../utils/MockDatabase';
import UserMenu from '../components/UserMenu';

const QUESTIONS = [
  { id: 1, category: 'Behavioral', text: 'Tell me about a time you led a team through a significant technical challenge.' },
  { id: 2, category: 'Technical', text: 'Walk me through optimizing a slow-performing database query.' },
  { id: 3, category: 'System Design', text: 'How would you design a scalable notification system for 10 million users?' },
  { id: 4, category: 'Problem Solving', text: 'Describe a critical decision you made with incomplete information.' },
  { id: 5, category: 'Culture Fit', text: 'What does "ownership" mean to you in an engineering context?' },
  { id: 6, category: 'Technical', text: 'Explain the differences between synchronous and asynchronous programming.' },
  { id: 7, category: 'Leadership', text: 'How do you approach mentoring junior engineers on your team?' },
  { id: 8, category: 'Closing', text: 'Where do you see yourself in 3 years, and why is this role the right step?' },
];

const categoryColor = (cat) => {
  if (cat === 'Technical') return 'bg-primary-light text-primary border-primary/10';
  if (cat === 'Behavioral') return 'bg-success-bg text-success border-success/10';
  if (cat === 'System Design') return 'bg-warning-bg text-warning border-warning/10';
  if (cat === 'Leadership') return 'bg-primary-light text-primary border-primary/10';
  return 'bg-surface-light text-text-muted border-border';
};

const InterviewRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const candidateId = location.state?.candidateId;
  
  const db = MockDB.get();
  const candidatesList = db.candidates || [];
  const candidate = candidateId 
    ? (candidatesList.find(c => String(c.id) === String(candidateId)) || candidatesList[0]) 
    : candidatesList[0];
    
  const jd = db.jd || { title: 'Senior Engineer', level: 'Senior' };

  const [timer, setTimer] = useState(0);
  // ... other states
  
  if (!candidate) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center">
        <div className="bg-white dark:bg-[#12122A] p-10 rounded-[32px] border border-border card-shadow max-w-md">
          <ShieldAlert className="text-error mx-auto mb-6" size={48} />
          <h2 className="text-2xl font-serif font-bold mb-4">No Candidate Selected</h2>
          <p className="text-text-muted text-sm mb-8">Please select a candidate from the dashboard or queue to start an interview.</p>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }
  const [currentQ, setCurrentQ] = useState(0);
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [flags, setFlags] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [notes, setNotes] = useState('');
  const [aiScore, setAiScore] = useState(null);
  const [sentiment, setSentiment] = useState('Neutral');
  const [showSummary, setShowSummary] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t + ' ';
          else interim += t;
        }
        setResponseText(prev => prev + final);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setResponseText('');
    setAiScore(null);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    // Score after stop
    setTimeout(() => scoreResponse(), 600);
  };

  const scoreResponse = (overrideText) => {
    const text = (overrideText || responseText || textInput).trim();
    if (!text) return;
    
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    // Gibberish detection
    const isGibberish = (str) => {
      if (str.length < 10) return false;
      const vowelCount = (str.match(/[aeiou]/gi) || []).length;
      const vowelRatio = vowelCount / str.length;
      const longWords = str.split(/\s+/).some(word => word.length > 20);
      return vowelRatio < 0.15 || vowelRatio > 0.6 || longWords;
    };

    let score = 0;
    
    if (isGibberish(text) || wordCount < 3) {
      score = parseFloat((1 + Math.random() * 2).toFixed(1)); // Very low score for gibberish
    } else {
      // Basic relevance check simulated with keywords
      const currentQuestion = QUESTIONS[currentQ].text.toLowerCase();
      const keywords = ['technical', 'team', 'challenge', 'database', 'optimization', 'design', 'users', 'decision', 'mentoring', 'engineering'];
      const matchedKeywords = keywords.filter(k => text.toLowerCase().includes(k) || currentQuestion.includes(k));
      
      const base = Math.min(4 + (wordCount / 15) + (matchedKeywords.length * 0.5), 9.5);
      score = parseFloat((base + Math.random() * 0.5).toFixed(1));
    }

    setAiScore(score);
    setSentiment(score >= 8.5 ? 'Positive' : score >= 7 ? 'Neutral' : 'Cautious');
  };

  const submitTextInput = () => {
    setResponseText(textInput);
    scoreResponse();
  };

  const handleFlag = () => setFlags(prev =>
    prev.includes(currentQ) ? prev.filter(f => f !== currentQ) : [...prev, currentQ]
  );

  const handleNext = () => {
    const response = responseText || textInput;
    setAnswers(prev => [...prev, {
      question: QUESTIONS[currentQ].text,
      response,
      score: aiScore,
      flagged: flags.includes(currentQ),
    }]);
    recognitionRef.current?.stop();
    setIsRecording(false);
    setResponseText('');
    setTextInput('');
    setAiScore(null);
    setSentiment('Neutral');
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setShowSummary(true);
    }
  };

  // Summary Screen
  useEffect(() => {
    if (showSummary && candidate?.id) {
      const avgScore = answers.length ? parseFloat((answers.reduce((a, b) => a + (b.score || 7), 0) / answers.length).toFixed(1)) : 7.0;
      MockDB.saveInterviewResult(candidate.id, avgScore);
    }
  }, [showSummary, candidate?.id, answers]);

  if (showSummary) {
    const avgScore = answers.length ? (answers.reduce((a, b) => a + (b.score || 7), 0) / answers.length).toFixed(1) : '--';
    return (
      <div className="p-4 md:p-8 max-w-[1100px] mx-auto animate-fade-in-up">
        <div className="text-center mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-[24px] md:rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <Brain size={32} className="text-white md:size-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text mb-3">Interview Complete</h1>
          <p className="text-[10px] md:text-sm text-text-muted font-bold uppercase tracking-widest">Candidate #{candidate.id} · {jd.title}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
          {[
            { l: 'AI Score', v: `${avgScore}/10`, c: 'text-primary' },
            { l: 'Completed', v: `${answers.length}/${QUESTIONS.length}`, c: 'text-success' },
            { l: 'Flags Raised', v: flags.length, c: 'text-warning' },
          ].map(s => (
            <div key={s.l} className="bg-surface rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow text-center">
              <div className={`text-4xl md:text-5xl font-serif font-bold ${s.c} mb-2`}>{s.v}</div>
              <div className="text-[10px] md:text-[11px] font-black text-text-muted uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="bg-surface rounded-[32px] md:rounded-[40px] border border-border card-shadow overflow-hidden mb-8">
          <div className="p-6 md:p-8 border-b border-border bg-surface-light/50 dark:bg-white/5">
            <h3 className="font-serif font-bold text-lg md:text-xl">Answer Breakdown</h3>
          </div>
          <div className="divide-y divide-border">
            {answers.map((a, i) => (
              <div key={i} className="p-4 md:p-6 flex items-start gap-4 md:gap-5">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-primary-light flex items-center justify-center text-primary font-black text-xs md:text-sm shrink-0">
                  {a.score >= 7 ? <CheckCircle size={16} className="text-success" /> : <ShieldAlert size={16} className="text-error" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-bold text-text mb-1 truncate">{a.question}</p>
                  <p className="text-[10px] md:text-[11px] text-text-muted italic line-clamp-1">{a.response || 'No response'}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  {a.flagged && <span className="bg-warning-bg text-warning px-2 md:px-3 py-1 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase">Flagged</span>}
                  <span className={`text-lg md:text-xl font-serif font-bold ${a.score >= 7 ? 'text-success' : 'text-error'}`}>{a.score?.toFixed(1) || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {notes && (
          <div className="bg-surface rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-border card-shadow mb-8">
            <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Interviewer Notes</div>
            <p className="text-xs md:text-sm text-text-mid italic dark:text-text-muted">{notes}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-10 py-4 rounded-[20px] md:rounded-[24px] bg-primary text-white font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3">
             Return to Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;
  const currentResponse = inputMode === 'text' ? textInput : responseText;

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-fade-in-up h-auto lg:h-[calc(100vh-1.5rem)] flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 shrink-0">
        <div className="flex items-center justify-between lg:justify-start gap-4 md:gap-5">
          <div className="flex items-center gap-2 md:gap-3 bg-surface border border-border rounded-xl md:rounded-2xl px-4 md:px-5 py-2 md:py-2.5 card-shadow shrink-0">
            <Timer size={16} className="text-primary" />
            <span className="font-serif text-lg md:text-xl font-bold text-primary">{fmt(timer)}</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border"></div>
          <div className="text-right sm:text-left">
            <div className="text-base md:text-lg font-serif font-bold flex flex-wrap items-center justify-end sm:justify-start gap-2">
              <span className="hidden xs:inline">Candidate</span> #{candidate.id}
              <span className={`text-[8px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full border ${sentiment === 'Positive' ? 'bg-success-bg text-success border-success/10' : sentiment === 'Cautious' ? 'bg-warning-bg text-warning border-warning/10' : 'bg-surface-light text-text-muted border-border'}`}>
                {sentiment}
              </span>
            </div>
            <div className="text-[9px] md:text-[11px] text-text-muted font-bold uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">{jd.level} {jd.title}</div>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 md:gap-4 order-3 lg:order-2">
          <span className="text-[9px] md:text-[11px] font-black text-text-muted uppercase tracking-widest shrink-0">Q{currentQ+1}/{QUESTIONS.length}</span>
          <div className="flex-1 h-2 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden border border-border">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-3 order-2 lg:order-3">
          <button onClick={() => navigate('/dashboard')} className="flex-1 lg:flex-none bg-error-bg text-error px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-error hover:text-white transition-colors">End Interview</button>
          <UserMenu user={db.user} />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-full lg:w-[320px] space-y-4 lg:overflow-y-auto shrink-0 pr-1 lg:block custom-scrollbar">
          <div className="bg-surface border border-border rounded-[24px] md:rounded-[28px] p-6 card-shadow">
            <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-5">Live AI Analysis</div>
            <div className="space-y-4">
              {[
                { l: 'Resume Score', v: candidate.score || 8.4, c: 'bg-primary' },
                { l: 'This Answer', v: aiScore, c: 'bg-success' },
              ].map(m => (
                <div key={m.l}>
                  <div className="flex justify-between text-[10px] md:text-[11px] font-bold mb-2">
                    <span className="text-text-muted uppercase tracking-widest">{m.l}</span>
                    <span className="text-primary font-black">{m.v != null ? `${m.v}/10` : '—'}</span>
                  </div>
                  <div className="h-1.5 bg-surface-light dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${m.c} transition-all duration-700 rounded-full`} style={{ width: m.v != null ? `${(m.v/10)*100}%` : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block bg-surface border border-border rounded-[28px] p-6 card-shadow">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Green Flags</div>
            <div className="space-y-3">
              {['Strong systems thinking', 'Measurable impact cited'].map(f => (
                <div key={f} className="flex items-start gap-3 bg-success-bg dark:bg-white/5 p-3.5 rounded-2xl border border-success/10">
                  <CheckCircle className="text-success shrink-0 mt-0.5" size={14} />
                  <p className="text-[11px] font-bold text-success dark:text-success/70">{f}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block bg-surface border border-border rounded-[28px] p-6 card-shadow">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Red Flags</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-error-bg dark:bg-white/5 p-3.5 rounded-2xl border border-error/10">
                <ShieldAlert className="text-error shrink-0 mt-0.5" size={14} />
                <p className="text-[11px] font-bold text-error dark:text-error/70">No cloud deployment evidence</p>
              </div>
              {flags.length > 0 && (
                <div className="flex items-start gap-3 bg-warning-bg dark:bg-white/5 p-3.5 rounded-2xl border border-warning/10">
                  <Flag className="text-warning shrink-0 mt-0.5" size={14} />
                  <p className="text-[11px] font-bold text-warning dark:text-warning/70">{flags.length} question(s) flagged</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[24px] md:rounded-[28px] p-6 card-shadow">
            <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><MessageSquare size={11} /> Interviewer Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Private interviewer notes..."
              className="w-full h-24 md:h-32 bg-surface-light dark:bg-white/5 border border-border rounded-2xl p-3 text-xs font-medium text-text dark:text-white resize-none focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 bg-surface border border-border rounded-[28px] md:rounded-[36px] p-6 md:p-10 card-shadow flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-8 md:mb-10 shrink-0">
            <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Question {currentQ+1} of {QUESTIONS.length}</span>
            <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${categoryColor(q.category)}`}>{q.category}</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center max-w-3xl mx-auto w-full">
            <div className="text-xl md:text-3xl font-serif font-bold text-text dark:text-white leading-tight mb-8 md:mb-10">
              "{q.text}"
            </div>

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-2 bg-surface-light dark:bg-white/5 border border-border rounded-2xl p-1.5 mb-6">
              <button
                onClick={() => setInputMode('voice')}
                className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${inputMode === 'voice' ? 'bg-surface text-primary shadow-md border border-border' : 'text-text-muted hover:text-text'}`}
              >
                <Mic size={14} /> Voice
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${inputMode === 'text' ? 'bg-surface text-primary shadow-md border border-border' : 'text-text-muted hover:text-text'}`}
              >
                <Type size={14} /> Type
              </button>
            </div>

            {/* Voice Mode */}
            {inputMode === 'voice' && (
              <div className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-[24px] md:rounded-[28px] p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    {/* Main Record Button */}
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={!speechSupported}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-lg ${speechSupported ? 'bg-primary text-white shadow-primary/30 hover:translate-y-[-2px] active:scale-95' : 'bg-surface-light text-text-muted border border-border cursor-not-allowed'}`}
                      >
                        <Mic size={18} /> {speechSupported ? 'Record' : 'N/A'}
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-error text-white font-black text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-error/30 hover:translate-y-[-2px] active:scale-95 transition-all animate-pulse"
                      >
                        <StopCircle size={18} /> Stop
                      </button>
                    )}
                  </div>
                  {isRecording && (
                    <div className="flex items-end gap-1 h-6">
                      {[1,2,3,4,5,6,7].map((_,i) => (
                        <div key={i} className="w-1 bg-primary rounded-full animate-bounce" style={{height:`${20+(i*10)}%`, animationDelay:`${i*0.07}s`}}></div>
                      ))}
                    </div>
                  )}
                  {aiScore && !isRecording && (
                    <div className="flex items-center gap-2 bg-primary-light dark:bg-white/5 border border-primary/10 px-4 py-2 rounded-2xl">
                      <Zap size={13} className="text-primary" /><span className="text-[10px] md:text-[11px] font-black text-primary">Score: {aiScore}/10</span>
                    </div>
                  )}
                </div>
                <div className="h-24 md:h-28 overflow-y-auto text-xs md:text-sm text-text-mid dark:text-text-muted leading-relaxed text-left italic scrollbar-hide">
                  {responseText || <span className="text-text-muted not-italic text-[10px] md:text-xs">Your speech will appear here...</span>}
                </div>
              </div>
            )}

            {/* Text Mode */}
            {inputMode === 'text' && (
              <div className="w-full bg-surface-light dark:bg-white/5 border border-border rounded-[24px] md:rounded-[28px] p-4 md:p-6">
                <textarea
                  value={textInput}
                  onChange={e => {
                    const val = e.target.value;
                    setTextInput(val);
                    if (val.trim().length > 10) {
                      scoreResponse(val);
                    }
                  }}
                  placeholder="Type response..."
                  className="w-full h-28 md:h-36 bg-surface border border-border rounded-2xl p-4 text-xs md:text-sm text-text resize-none focus:outline-none focus:border-primary transition-all font-medium mb-4"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] md:text-[11px] text-text-muted">{textInput.split(' ').filter(Boolean).length} words</span>
                  <div className="flex items-center gap-3">
                    {aiScore && (
                      <div className="flex items-center gap-2 bg-primary-light dark:bg-white/5 border border-primary/10 px-4 py-2 rounded-2xl">
                        <Zap size={13} className="text-primary" /><span className="text-[10px] md:text-[11px] font-black text-primary">Score: {aiScore}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between mt-auto pt-6 border-t border-border shrink-0 gap-4">
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button
                onClick={() => { recognitionRef.current?.stop(); setIsRecording(false); setResponseText(''); setTextInput(''); setCurrentQ(q => Math.max(0, q-1)); }}
                disabled={currentQ === 0}
                className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-3.5 rounded-[16px] md:rounded-[18px] bg-surface-light text-text-mid font-bold border border-border hover:bg-surface transition-all flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-40"
              >
                ← <span className="hidden xs:inline">Back</span>
              </button>
              <button
                onClick={handleFlag}
                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-3.5 rounded-[16px] md:rounded-[18px] font-bold border transition-all flex items-center justify-center gap-2 text-xs md:text-sm ${flags.includes(currentQ) ? 'bg-warning text-white border-warning shadow-lg shadow-warning/20' : 'bg-warning-bg text-warning border-warning/20 hover:bg-warning hover:text-white'}`}
              >
                <Flag size={15} /> <span className="hidden xs:inline">{flags.includes(currentQ) ? 'Flagged' : 'Flag'}</span>
              </button>
              <button
                onClick={() => { setResponseText(''); setTextInput(''); setAiScore(null); }}
                className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-3.5 rounded-[16px] md:rounded-[18px] bg-surface-light text-text-mid font-bold border border-border hover:bg-surface transition-all text-xs md:text-sm"
              >
                Clear
              </button>
            </div>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 md:px-10 py-3.5 rounded-[18px] md:rounded-[22px] bg-primary text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all text-xs md:text-sm uppercase tracking-widest active:scale-95"
            >
              {currentQ === QUESTIONS.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
