import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('otp');
      } else {
        setError(data.error || 'Identity verification failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Neural connection failure. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        localStorage.setItem('admin_auth', 'true');
        window.dispatchEvent(new Event('storage'));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid secure token.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Access Denied: Buffer Overflow.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] obsidian-gradient opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] obsidian-gradient opacity-5 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-5 bg-obsidian-container-high rounded-[2rem] border border-white/10 shadow-2xl mb-6 shadow-obsidian-primary/20"
          >
            <Cpu className="text-obsidian-primary" size={40} />
          </motion.div>
          <h2 className="text-5xl font-black obsidian-text-gradient tracking-tighter font-manrope mb-2">NexusCore</h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">Administrative Access Portal</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="glass-card p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-8"
                onSubmit={handleLogin}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Terminal ID (Email)</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-obsidian-primary transition-colors" size={20} />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="root@nexuscms.io"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Access Key (Password)</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-obsidian-primary transition-colors" size={20} />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center text-red-400 text-xs font-bold bg-red-400/10 p-4 rounded-2xl border border-red-400/20"
                  >
                    <ShieldAlert size={16} className="mr-3" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 obsidian-gradient text-white font-black rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                >
                  <span className="tracking-widest uppercase text-xs">Authorize Access</span>
                  {!loading && <ArrowRight size={18} />}
                  {loading && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
                onSubmit={handleVerifyOtp}
              >
                <div className="text-center mb-4">
                  <div className="inline-flex p-4 bg-obsidian-primary/10 rounded-2xl mb-4 border border-obsidian-primary/20">
                    <ShieldCheck size={32} className="text-obsidian-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-manrope">Verify Token</h3>
                  <p className="text-xs text-gray-500 font-medium">A single-use access code has been deployed to <br/><span className="text-obsidian-primary font-bold">{email}</span></p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mb-6">Enter Secure OTP</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full py-6 bg-obsidian-container-high/40 border-2 border-dashed border-white/10 rounded-3xl text-white text-center text-4xl font-black outline-none focus:ring-4 focus:ring-obsidian-primary/20 focus:border-obsidian-primary/40 transition-all tracking-[0.5em]"
                    placeholder="000000"
                  />
                </div>

                {error && (
                  <div className="flex items-center text-red-400 text-xs font-bold bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
                    <ShieldAlert size={16} className="mr-3" />
                    {error}
                  </div>
                )}

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 obsidian-gradient text-white font-black rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {loading ? 'Decrypting...' : 'Verify Identity'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="text-[10px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors py-2"
                  >
                    Retract Authorization
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        
        <p className="text-center mt-12 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          &copy; 2026 NexusCMS Security Infrastructure • Encrypted Connection
        </p>
      </div>
    </div>
  );
}
