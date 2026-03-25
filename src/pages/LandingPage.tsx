import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X, ShieldCheck, UserCircle, ArrowRight, CreditCard, BookOpen, Users, Trophy, Star, CheckCircle, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EnrollModal from '../components/EnrollModal';

export default function LandingPage() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setPopularCourses(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(err => console.error('Failed to load courses:', err));
      
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data || {}))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 3000);
      } else {
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 3000);
      }
    } catch (err) {
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  };

  const getCourseColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-red-500', 'bg-orange-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-obsidian-surface text-on-surface font-inter antialiased selection:bg-obsidian-primary/30 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] obsidian-gradient opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] obsidian-gradient opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

      <EnrollModal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} />
      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-obsidian-surface/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="p-3 bg-obsidian-container-high rounded-[1.25rem] group-hover:scale-110 transition-all shadow-xl group-hover:shadow-glow">
              <GraduationCap className="text-obsidian-primary" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white tracking-tighter leading-none">
                {settings.institute_name || 'NexusCMS'}
              </span>
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Academic Core</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-12 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Link to="/" className="text-obsidian-primary border-b-2 border-obsidian-primary pb-1">Nexus::Home</Link>
            <Link to="/courses" className="text-gray-500 hover:text-white transition-colors">Nexus::Courses</Link>
            <Link to="/pay" className="premium-button px-8 py-3.5 shadow-glow">
              Authorize Portal
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-4 bg-obsidian-container-high rounded-2xl text-white shadow-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-white dark:bg-gray-950 border-b dark:border-white/5 p-6 lg:hidden shadow-2xl space-y-4"
            >
              <Link 
                to="/" 
                className="block p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                className="block p-4 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                to="/pay" 
                className="block p-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2rem] font-black text-center shadow-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                STUDENT PORTAL
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-obsidian-primary/10 border border-obsidian-primary/20 text-obsidian-primary text-xs font-black uppercase tracking-widest mb-8">
              <Star size={14} className="mr-2" /> Top Rated Academic Infrastructure
            </div>
            <h1 className="text-5xl md:text-8xl font-black obsidian-text-gradient tracking-tighter font-manrope leading-[0.9]">
              Future Starts <br/>
              <span className="text-white">With NexusCMS</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg text-gray-400 font-medium leading-relaxed opacity-80">
              The ultimate high-performance coaching ecosystem. Deploy your academic career with precision-engineered learning modules and data-driven monitoring.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="premium-button flex items-center justify-center px-12 py-5 shadow-2xl"
              >
                <span className="tracking-widest uppercase text-xs">Enroll Securely</span>
                <ArrowRight size={20} className="ml-3" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-blue-50 dark:bg-blue-900/10 rounded-3xl overflow-hidden shadow-2xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <Trophy className="text-yellow-500 mb-4" size={32} />
                  <h3 className="font-bold text-gray-900 dark:text-white">Success Rate</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">98% students qualified</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <Users className="text-blue-500 mb-4" size={32} />
                  <h3 className="font-bold text-gray-900 dark:text-white">Expert Faculty</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">IITians & PhD holders</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <BookOpen className="text-purple-500 mb-4" size={32} />
                  <h3 className="font-bold text-gray-900 dark:text-white">Study Material</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive & updated</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <CreditCard className="text-orange-500 mb-4" size={32} />
                  <h3 className="font-bold text-gray-900 dark:text-white">Easy Fees</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Online & offline modes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* About Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Our Coaching</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              With over 15 years of experience, we have been the cornerstone of academic excellence for thousands of students.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Personalized Attention', desc: 'Small batch sizes to ensure every student gets the attention they deserve.' },
              { title: 'Modern Infrastructure', desc: 'Smart classrooms and digital labs for an immersive learning experience.' },
              { title: 'Regular Assessments', desc: 'Weekly tests and performance tracking to monitor progress effectively.' },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <CheckCircle className="text-green-500 mb-4" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Popular Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose the path that leads to your dream career.</p>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline">
              View All Courses <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course, i) => (
              <Link 
                to={course.name?.toLowerCase().includes('10') ? '/course/cbse-10' : '/courses'}
                key={course.id} 
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 dark:bg-gray-800 block cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={course.image_url || `https://picsum.photos/seed/${course.name}/400/500`}
                  alt={course.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider mb-2 ${getCourseColor(i)}`}>
                    {course.level || 'Coaching'}
                  </span>
                  <h3 className="text-xl font-bold text-white">{course.name}</h3>
                </div>
              </Link>
            ))}
            {popularCourses.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No courses available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800 pt-20 pb-10 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 dark:text-white">
              <GraduationCap className="text-blue-600 dark:text-blue-400" size={32} />
              <span className="text-2xl font-bold tracking-tight">{settings.institute_name || 'NexusCMS'}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Empowering students with world-class education, expert faculty, and a nurturing environment to build the leaders of tomorrow.
            </p>
            <div className="flex space-x-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Twitter size={18} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all">
                  <Instagram size={18} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Home</Link></li>
              <li><Link to="/courses" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Courses</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{settings.address || '123 Education Lane, Knowledge Park,\nNew Delhi, India 110001'}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <Phone size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{settings.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{settings.email || 'contact@nexuscms.edu'}</span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
            <form className="space-y-3" onSubmit={handleContactSubmit}>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                placeholder="Your Name" 
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
                disabled={contactStatus === 'loading'}
              />
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                placeholder="Email Address" 
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
                disabled={contactStatus === 'loading'}
              />
              <textarea 
                placeholder="Your Message..." 
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                rows={2}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                required
                disabled={contactStatus === 'loading'}
              ></textarea>
              <button 
                type="submit" 
                disabled={contactStatus === 'loading'}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg text-sm flex items-center justify-center transition-all shadow-lg ${
                  contactStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                  contactStatus === 'error' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {contactStatus === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : contactStatus === 'success' ? (
                  <><CheckCircle size={14} className="mr-2" /> Sent Successfully</>
                ) : contactStatus === 'error' ? (
                  <>Failed. Try Again</>
                ) : (
                  <><Send size={14} className="mr-2" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {settings.institute_name || 'NexusCMS'}. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs text-center md:text-right">
            Created By - Divyanshu Kumar
          </p>
        </div>
      </footer>
    </div>
  );
}
