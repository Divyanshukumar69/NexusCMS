import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, BookOpen, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsConditions() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data || {}))
      .catch(err => console.error('Failed to load settings:', err));
    window.scrollTo(0, 0);
  }, []);

  const instituteName = settings.institute_name || 'NexusCMS Coaching';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600 dark:text-blue-400" size={32} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{instituteName}</span>
          </Link>
          <Link to="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <header className="text-center space-y-4">
            <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-2">
              <BookOpen size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Terms & Conditions</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Guidelines and legal terms for accessing our Coaching Management System.
            </p>
          </header>

          <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
            <section className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using the Coaching Management System at {instituteName}, you agree to comply with these Terms & Conditions. Continued usage of our services implies your acceptance of any periodic updates to these terms.</p>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Students', desc: 'Can view courses, pay fees, and track academic progress seamlessly.' },
                { title: 'Teachers', desc: 'Manage classes, attendance, and student performance data.' },
                { title: 'Admins', desc: 'Full system control, administrative oversight and institute security.' },
              ].map((role, i) => (
                <div key={i} className="p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 font-bold text-sm">{i+2}</div>
                   <h3 className="font-bold text-gray-900 dark:text-white mb-2">{role.title}</h3>
                   <p className="text-sm opacity-80 leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </section>

            <section className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                 <ShieldAlert className="mr-3 text-blue-600" size={24} /> 3. Account Responsibility
               </h2>
               <div className="grid md:grid-cols-2 gap-8 text-sm">
                 <div className="space-y-4">
                    <p className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[10px]">Your Obligations</p>
                    <ul className="space-y-3 list-none p-0">
                      <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2" /> Provide accurate personal information</li>
                      <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2" /> Maintain confidentiality of credentials</li>
                    </ul>
                 </div>
                 <div className="space-y-4">
                    <p className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[10px]">Unauthorized Access</p>
                    <p>Users are responsible for all activities in their account. Any unauthorized use must be reported to the administration immediately for account suspension/revision.</p>
                 </div>
               </div>
            </section>

            <section className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 grid md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                   <Clock className="mr-3 text-orange-500" /> 4. Fee & Payments
                 </h2>
                 <p className="text-sm">Fees must be paid through approved payment methods. Fees once paid are non-refundable unless specified. Late payments may result in restricted access.</p>
               </div>
               <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                   <AlertTriangle className="mr-3 text-red-500" /> 5. Usage Rules
                 </h2>
                 <p className="text-sm italic">"Users agree NOT to misuse the system, attempt unauthorized access, or upload illegal content."</p>
               </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Institutional Responsibilities</h2>
              <div className="p-8 bg-gray-900 text-gray-400 rounded-[2.5rem] shadow-2xl space-y-4 border border-white/5">
                <p>Teachers must ensure accuracy of academic data. Management is responsible for maintaining system integrity. Any misuse may lead to account suspension without prior notice.</p>
                <p>We strive for uninterrupted service but do not guarantee 100% uptime. Maintenance or technical issues may temporarily affect access.</p>
              </div>
            </section>

            <div className="p-10 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-6">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Limitation of Liability</h2>
               <p className="text-sm opacity-80">
                 {instituteName} is not responsible for payment gateway failures, data loss due to external factors, or unauthorized access caused by user negligence. These terms are governed by the laws of India.
               </p>
               <div className="flex flex-col sm:flex-row gap-8 pt-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Support</p>
                     <p className="text-gray-900 dark:text-white font-bold">{settings.email || 'Email missing'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Support</p>
                     <p className="text-gray-900 dark:text-white font-bold">{settings.phone || 'Phone missing'}</p>
                  </div>
               </div>
            </div>

            <div className="text-center pt-8 border-t dark:border-gray-800 pb-10">
               <p className="text-sm font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Official Documentation</p>
               <p className="text-xs text-gray-400 max-w-lg mx-auto italic">By clicking "Next" or using any part of the portal, you signify your full agreement to the above terms and conditions of coaching system operations.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
