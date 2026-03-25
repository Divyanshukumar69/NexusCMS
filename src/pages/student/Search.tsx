import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, User, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentSearch() {
  const [studentId, setStudentId] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [dbId, setDbId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/student-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setDbId(data.studentDbId);
        setMaskedEmail(data.maskedEmail);
        setStep(2);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Student not found. Check your ID.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/verify-student-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim(), otp: otp.trim() })
      });
      if (res.ok) {
        navigate(`/pay/${dbId}`);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600 dark:text-blue-400" size={32} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">NexusCMS</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Home</Link>
              <Link to="/courses" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Courses</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pay" className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
              <User className="text-blue-600 dark:text-blue-400" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Portal</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {step === 1 ? 'Enter your Student ID to receive a secure OTP.' : (
                <>
                  We sent an OTP to <span className="text-blue-600 dark:text-blue-400 font-semibold">{maskedEmail}</span>
                </>
              )}
            </p>
          </motion.div>

          <form onSubmit={step === 1 ? handleStep1 : handleStep2} className="space-y-4">
            {step === 1 ? (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Student ID (e.g. COACH-001)"
                  className="w-full pl-14 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 focus:border-blue-600 dark:focus:border-blue-400 rounded-2xl text-lg outline-none transition-all text-gray-900 dark:text-white shadow-sm"
                />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="relative"
              >
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-4 bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-600 dark:focus:border-blue-400 rounded-2xl text-center text-2xl tracking-widest outline-none transition-all text-gray-900 dark:text-white shadow-sm font-mono"
                  maxLength={6}
                />
              </motion.div>
            )}

            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              {loading ? (step === 1 ? 'Sending...' : 'Verifying...') : (step === 1 ? 'Request OTP' : 'Verify & Login')}
              {!loading && step === 1 && <ArrowRight size={20} className="ml-2" />}
            </button>
            
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full py-2 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                disabled={loading}
              >
                Go back & use a different ID
              </button>
            )}
          </form>

          <div className="mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center">
              <HelpCircle size={16} className="mr-2 text-blue-600 dark:text-blue-400" /> Need Help?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              If you don't know your Student ID, please contact the institute administration or check your admission receipt.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
