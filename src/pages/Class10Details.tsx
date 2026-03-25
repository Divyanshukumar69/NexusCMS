import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, ArrowLeft, Download, Send, Phone, Info, CheckCircle, 
  BookOpen, Calculator, Beaker, Globe, Languages, Cpu, ListChecks, 
  Calendar, Award, Star, TrendingUp, GraduationCap as GraduationCapIcon,
  GraduationCap as GradIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import EnrollModal from '../components/EnrollModal';

export default function Class10Details() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subjects = [
    { title: 'Science', icon: Beaker, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/10', desc: 'Build fundamentals in Physics, Chemistry, and Biology.', topics: ['Chemical Reactions', 'Life Processes', 'Light & Electricity'] },
    { title: 'Mathematics', icon: Calculator, color: 'text-red-600 bg-red-50 dark:bg-red-900/10', desc: 'Choose between Standard & Basic levels.', topics: ['Real Numbers', 'Linear Equations', 'Trigonometry'] },
    { title: 'English', icon: BookOpen, color: 'text-green-600 bg-green-50 dark:bg-green-900/10', desc: 'Enhance language, writing, and literature skills.', topics: ['Reading Comprehension', 'Grammar', 'First Flight'] },
    { title: 'Social Science', icon: Globe, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/10', desc: 'Understand society, economy, and governance.', topics: ['History', 'Geography', 'Political Science'] },
    { title: 'Hindi', icon: Languages, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/10', desc: 'Focus on language skills and literature.', topics: ['Reading & Writing', 'Grammar', 'Literature'] },
    { title: 'Optional', icon: Cpu, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/10', desc: 'IT, AI, Sanskrit, or Computer Applications.', topics: ['IT', 'Artificial Intelligence', 'Sanskrit'] },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600 dark:text-blue-400" size={32} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight italic">NexusCMS</span>
          </Link>
          <Link to="/courses" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            <ArrowLeft size={18} className="mr-2" /> All Courses
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-8"
          >
            Academic Session 2026–27
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter"
          >
            CBSE Class 10 – <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Build Your Future
            </span> with Confidence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            A structured, skill-based curriculum designed to strengthen concepts, improve problem-solving, and prepare students for board exams and beyond.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center">
              <Download size={20} className="mr-3" /> Download Syllabus
            </button>
            <button 
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-10 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center"
            >
              <Send size={20} className="mr-3" /> Enroll Now (Class 10)
            </button>
            <a 
              href="tel:9798263469"
              className="px-10 py-5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center"
            >
              <Phone size={20} className="mr-3" /> Book Demo
            </a >
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
             <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-3xl text-blue-600 dark:text-blue-400 mb-8 items-center justify-center">
                <Info size={32} />
             </div>
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">About the Program</h2>
             <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                The CBSE Class 10 curriculum for the academic session 2026–27 is designed to balance conceptual clarity, practical application, and analytical thinking. <br/><br/>
                With a focus on competency-based learning, students are trained not just to memorize, but to understand and apply knowledge in real-life situations.
             </p>
          </div>
      </section>

      {/* Subjects Section */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic tracking-tight uppercase">Subjects Covered</h2>
                <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-8 bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-6`}>
                       <s.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{s.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">{s.desc}</p>
                    <div className="space-y-3">
                       {s.topics.map((topic, ti) => (
                          <div key={ti} className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                             <CheckCircle size={14} className="text-blue-500 mr-2 shrink-0" />
                             {topic}
                          </div>
                       ))}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
      </section>

      {/* Exam Pattern Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
             <div className="flex items-center justify-center space-x-4 mb-16">
                <ListChecks className="text-blue-400" size={32} />
                <h2 className="text-4xl font-bold tracking-tight">Exam Pattern (2026–27)</h2>
             </div>
             <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden">
                <div className="grid grid-cols-3 p-6 bg-white/10 text-xs font-black uppercase tracking-widest text-blue-400">
                   <div>Section</div>
                   <div>Type of Questions</div>
                   <div className="text-right">Marks</div>
                </div>
                {[
                  { section: 'A', type: 'MCQs', marks: '1 Mark' },
                  { section: 'B', type: 'Very Short Answer', marks: '2 Marks' },
                  { section: 'C', type: 'Short Answer', marks: '3 Marks' },
                  { section: 'D', type: 'Long Answer', marks: '5 Marks' },
                  { section: 'E', type: 'Case Study', marks: 'Varies' },
                ].map((row, i) => (
                   <div key={i} className="grid grid-cols-3 p-6 border-t border-white/5 hover:bg-white/5 transition-colors">
                      <div className="font-bold">{row.section}</div>
                      <div className="text-gray-400 font-medium">{row.type}</div>
                      <div className="text-right font-black text-blue-400">{row.marks}</div>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* Key Highlights & Study Plan */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-10">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">🚀 Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                   {[
                     'Competency-Based Learning', 'Case Study & Application', 'Reduced & Optimized Syllabus', 
                     'Real-Life Understanding', 'Strong Foundation for Class 11', 'Expert Counseling'
                   ].map((text, i) => (
                      <div key={i} className="flex items-center p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                         <Star size={20} className="text-yellow-500 mr-3" />
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{text}</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="p-10 bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Calendar className="text-blue-600/20" size={64} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 italic uppercase tracking-widest">
                  Smart Study Plan
                </h2>
                <div className="space-y-8">
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Daily Plan (Weekdays)</p>
                      <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                         <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">Maths: 1 Hour</div>
                         <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">Science: 1 Hour</div>
                         <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl">SST: 45 Min</div>
                         <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">Revision: 30 Min</div>
                      </div>
                   </div>
                   <div className="pt-4 border-t dark:border-gray-800 space-y-3">
                      <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Weekend Strategy</p>
                      <ul className="grid gap-2 list-none p-0 text-sm font-bold text-gray-600 dark:text-gray-400">
                         <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-600 mr-2" /> Full Mock Test</li>
                         <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-600 mr-2" /> Mistake Analysis</li>
                         <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-600 mr-2" /> Weak Area Revision</li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 text-center">
         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-16 tracking-tight">Why Choose This Program?</h2>
         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { icon: BookOpen, label: 'NCERT-Focused' },
              { icon: Beaker, label: 'Practical Labs' },
              { icon: TrendingUp, label: 'Test Tracking' },
              { icon: Award, label: 'Expert Faculty' },
              { icon: Star, label: 'Board Strategy' }
            ].map((item, i) => (
               <div key={i} className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-blue-600/30 transition-all duration-500">
                     <item.icon size={30} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
               </div>
            ))}
         </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
         <div className="p-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -ml-32 -mt-32" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight italic">Ready to Excel in Class 10 Boards?</h2>
               <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Start your journey today with structured learning, expert support, and a results-driven environment.
               </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <button 
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl transition-all"
                  >
                    Apply Now 2026
                  </button>
                  <a 
                    href="tel:9798263469"
                    className="flex items-center text-sm font-bold bg-white/10 px-8 py-5 rounded-2xl hover:bg-white/20 transition-all text-white no-underline"
                  >
                     <Phone size={18} className="mr-2" /> Book a Demo Class
                  </a>
                </div>
            </div>
         </div>
      </section>

      {/* Footer Mini */}
      <footer className="py-10 border-t dark:border-gray-800 text-center">
         <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">NexusCMS Educational Network • CBSE Excellence Center</p>
      </footer>

      <EnrollModal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
        initialCourseId={"" /* We'll let user select for now or find it via API */} 
      />
    </div>
  );
}
