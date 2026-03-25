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
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enroll Now</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start your journey with NexusCMS Coaching</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <User size={16} className="mr-2 text-blue-600" /> Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <User size={16} className="mr-2 text-blue-600" /> Parent Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Guardian's Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <Phone size={16} className="mr-2 text-blue-600" /> Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <Mail size={16} className="mr-2 text-blue-600" /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <BookOpen size={16} className="mr-2 text-blue-600" /> Select Class *
                    </label>
                    <select
                      required
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    >
                      <option value="">Select Grade</option>
                      {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <ArrowRight size={16} className="mr-2 text-blue-600" /> Current Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Full residential address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <GraduationCap size={16} className="mr-2 text-blue-600" /> Previous School (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.previous_school}
                    onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Name of your last school"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <MessageSquare size={16} className="mr-2 text-blue-600" /> Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                    placeholder="Tell us about your goals..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white dark:border-gray-900"></div>
                  ) : (
                    <>Submit Application <ArrowRight size={20} className="ml-2" /></>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpVerify} className="space-y-6 text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Phone Number</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    We've sent a 6-digit code to <span className="font-bold text-gray-900 dark:text-white">{formData.phone}</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-3xl tracking-[1em] font-bold px-4 py-4 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="000000"
                  />
                  <p className="text-xs text-gray-400">Hint: Use 123456 for demo</p>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <div className="flex flex-col space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Enroll'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle size={56} />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Enrollment Successful!</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
                  Thank you for choosing NexusCMS Coaching. Our academic counselor will contact you shortly to complete the process.
                </p>
                <button
                  onClick={onClose}
                  className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
