import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Phone, Mail, User, BookOpen, MessageSquare, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
}

export default function EnrollModal({ isOpen, onClose, initialCourseId }: EnrollModalProps) {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    email: '',
    phone: '',
    courseId: initialCourseId || '',
    address: '',
    previous_school: '',
    message: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setFormData(prev => ({ ...prev, courseId: initialCourseId || '' }));
      
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCourses(data.map((c: any) => ({ id: c.id, name: c.name })));
          }
        })
        .catch(err => console.error('Failed to load courses:', err));
    }
  }, [isOpen, initialCourseId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.courseId) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Enroll Error:', err);
      setError(err.message || 'Database operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') { // Mock OTP for demo
      setError('Invalid OTP. Use 123456 for testing.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStep(3);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Enroll Error:', err);
      setError('Database operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-card overflow-hidden"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div>
              <h2 className="text-4xl font-black obsidian-text-gradient tracking-tighter font-manrope">Enroll Now</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 opacity-80">Start your journey with NexusCMS</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-obsidian-container-high rounded-2xl text-gray-500 hover:text-white transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {step === 1 && (
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Student Full Name *</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="Adarsh Kumar"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Parent/Guardian Name *</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="Sanjeev Kumar"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contact Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number *</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Academic Grade *</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <select
                        required
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-obsidian-surface text-gray-400">Select Target Class</option>
                        {courses.map(course => <option key={course.id} value={course.id} className="bg-obsidian-container-high text-white">{course.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Previous School</label>
                    <div className="relative group">
                      <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-obsidian-primary" size={18} />
                      <input
                        type="text"
                        value={formData.previous_school}
                        onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                        placeholder="e.g. Adarsh Public School"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-6 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all resize-none"
                    placeholder="Residential address for postal communication"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 premium-button shadow-2xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <span className="flex items-center justify-center tracking-widest uppercase text-xs">
                      Submit Secure Application <ArrowRight size={18} className="ml-3" />
                    </span>
                  )}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-24 h-24 bg-obsidian-primary/20 text-obsidian-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow"
                >
                  <CheckCircle size={56} />
                </motion.div>
                <h3 className="text-4xl font-black text-white mb-4 font-manrope tracking-tight">Application Received</h3>
                <p className="text-gray-400 font-medium text-lg mb-10 leading-relaxed max-w-sm mx-auto">
                  Your academic profile has been submitted. Our counselor will initiate contact within 24 hours.
                </p>
                <button
                  onClick={onClose}
                  className="px-12 py-5 bg-obsidian-container-high text-white font-black rounded-2xl hover:bg-obsidian-container-highest transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Return to Site
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
