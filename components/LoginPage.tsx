import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPageProps {
  onNext: (data: Partial<UserProfile>) => void;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'VERIFY';

const LoginPage: React.FC<LoginPageProps> = ({ onNext }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    language: 'English'
  });

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'];

  const handleNextSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate OTP sending delay
    setTimeout(() => {
      setLoading(false);
      setView('VERIFY');
    }, 1200);
  };

  const handleVerifyOTP = async () => {
    setError(null);
    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      const code = otp.join('');
      if (code === '123456') {
        onNext(formData);
      } else {
        setError("Invalid OTP. For demo purposes, use 123456.");
        setLoading(false);
      }
    }, 1000);
  };

  const updateOtp = (value: string, index: number) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full px-8 pt-24 bg-white">
      <AnimatePresence mode="wait">
        {view === 'VERIFY' ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <button onClick={() => setView('SIGNUP')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="text-4xl font-black tracking-tighter text-black">Verify OTP</h2>
            <p className="text-slate-400 mt-2 font-medium">Demo code: 123456</p>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-bold">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex justify-between mt-12 gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="number"
                  value={digit}
                  onChange={(e) => updateOtp(e.target.value, i)}
                  className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-black text-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.some(d => !d)}
              className="w-full mt-12 bg-black text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {loading ? "Confirming..." : "Verify & Continue"} <ShieldCheck size={20} className="text-emerald-500" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-black">
                {view === 'LOGIN' ? 'Welcome Back' : 'Join Atlas'}
              </h2>
              <p className="text-slate-400 mt-2 font-medium">
                Access your personalized transit dashboard instantly.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-bold leading-tight">
                <AlertCircle size={14} className="flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleNextSteps} className="space-y-6">
              <div className="space-y-4">
                <div className="relative border-b-2 border-slate-100 focus-within:border-emerald-500 transition-colors py-2">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">Phone Number</span>
                  <input
                    type="tel"
                    required
                    className="w-full bg-transparent py-2 font-bold text-lg outline-none placeholder:text-slate-200 text-emerald-500"
                    placeholder="+91 000 000 0000"
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="relative border-b-2 border-slate-100 focus-within:border-emerald-500 transition-colors py-2">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">Email ID</span>
                  <input
                    type="email"
                    required
                    className="w-full bg-transparent py-2 font-bold text-lg outline-none placeholder:text-slate-200 text-emerald-500"
                    placeholder="hello@atlas.com"
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="relative border-b-2 border-slate-100 focus-within:border-emerald-500 transition-colors py-2">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">Language</span>
                  <select
                    className="w-full bg-transparent py-2 font-bold text-lg outline-none cursor-pointer appearance-none text-emerald-500"
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-black text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
              >
                {loading ? "Processing..." : "Next Steps"} <ArrowRight size={20} className="text-emerald-500" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setView(view === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors underline underline-offset-8 decoration-2"
              >
                {view === 'LOGIN' ? "New here? Sign Up" : "Already have an account? Log In"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;