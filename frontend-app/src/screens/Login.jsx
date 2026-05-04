import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ChevronRight, Globe } from 'lucide-react';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sara.abraham@hirewell.ai');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-[1100px] bg-white rounded-[32px] md:rounded-[48px] shadow-2xl shadow-primary/10 flex flex-col md:flex-row overflow-hidden border border-border relative z-10 animate-fade-in-up">
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 bg-primary p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <div className="grid-bg w-full h-full"></div>
           </div>
           
           <div className="relative z-10 text-center md:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black font-serif text-2xl mb-6 md:mb-8 shadow-xl mx-auto md:mx-0">H</div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6 leading-tight">Hire merit,<br className="hidden md:block"/>not metrics.</h1>
              <p className="text-primary-light/80 text-sm md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 hidden sm:block">
                 The world's first bias-shielded recruitment platform. Screen candidates purely on potential.
              </p>
           </div>

           <div className="relative z-10 space-y-6 hidden md:block">
              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"><Shield size={20} /></div>
                 <div>
                    <div className="text-sm font-bold">Bias Shield Active</div>
                    <div className="text-xs text-primary-light/60">Anonymizing candidates in real-time</div>
                 </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-primary-light/40 uppercase tracking-[0.2em]">
                 <span>v2.4.0 Secure</span>
                 <span>Cloud Infrastructure</span>
              </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
           <div className="max-w-sm mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-2">Welcome Back</h2>
              <p className="text-text-muted text-xs md:text-sm mb-8 md:mb-10 font-medium">Please enter your credentials to continue</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Work Email</label>
                    <div className="relative">
                       <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                       <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-surface-light border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                          placeholder="name@company.com"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                       <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                       <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                       <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                       <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-surface-light border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                          placeholder="••••••••"
                       />
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-primary text-white py-4 rounded-[20px] font-bold text-md shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-8">
                    Login to Dashboard <ChevronRight size={20} />
                 </button>

                 <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-text-muted">Or continue with</span></div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl font-bold text-xs hover:bg-surface-light transition-colors">
                       <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl font-bold text-xs hover:bg-surface-light transition-colors">
                       <Globe size={16} /> GitHub
                    </button>
                 </div>
              </form>
              
              <p className="text-center mt-12 text-xs text-text-muted font-medium">
                 Don't have an account? <button className="text-primary font-bold hover:underline">Request Access</button>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
