import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle, BookOpen, Clock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import EnrollModal from '../components/EnrollModal';

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load courses:', err);
        setLoading(false);
      });
  }, []);

  const getCourseColor = (index: number) => {
    const colors = [
      { text: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-100 dark:border-blue-900/50' },
      { text: 'text-red-600 bg-red-50 dark:bg-red-900/30', border: 'border-red-100 dark:border-red-900/50' },
      { text: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-100 dark:border-orange-900/50' },
      { text: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-100 dark:border-purple-900/50' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
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
              <Link to="/courses" className="text-blue-600 dark:text-blue-400 font-semibold">Courses</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/pay" className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Explore Our <span className="text-blue-600 dark:text-blue-400">Programs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            We offer a wide range of specialized coaching programs designed to help you excel in your academic and professional journey.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-12">
            {courses.map((course, index) => {
              const theme = getCourseColor(index);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex flex-col lg:flex-row bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <div className="lg:w-2/5 relative overflow-hidden min-h-[300px]">
                    <img 
                      src={course.image_url || `https://picsum.photos/seed/${course.name}/800/600`} 
                      alt={course.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    <div className="absolute top-6 left-6">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${theme.text} backdrop-blur-md`}>
                        {course.level || 'Coaching Program'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Clock size={16} className="mr-2" />
                        {course.duration_months} Months
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <CreditCard size={16} className="mr-2" />
                        ₹{course.monthly_fee}/month
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      {course.name}
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                      {course.description || 'Comprehensive coaching program designed to build strong concepts and help you excel in your exams.'}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                      {(course.features || ['Expert Faculty', 'Weekly Mock Tests', 'Study Material', 'Doubt Clearing Sessions']).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setIsEnrollModalOpen(true);
                        }}
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center group/btn"
                      >
                        Enroll Now
                        <ArrowRight size={20} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                      <Link 
                        to={course.name?.toLowerCase().includes('10') ? '/course/cbse-10' : '#'}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800 py-12 px-6 bg-white dark:bg-gray-950 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 opacity-50 dark:text-white">
            <GraduationCap size={24} />
            <span className="text-lg font-bold">NexusCMS</span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Home</Link>
            <Link to="/courses" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Courses</Link>
            <Link to="/pay" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Student Portal</Link>
          </div>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            © 2026 NexusCMS Management System. Built for modern institutes.
            <br />
            <span className="text-xs opacity-75">Created By - Divyanshu Kumar</span>
          </p>
        </div>
      </footer>

      <EnrollModal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
        initialCourseId={selectedCourseId}
      />
    </div>
  );
}
