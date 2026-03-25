import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <header className="text-center space-y-4">
            <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-2">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              How we collect, use, and protecting your personal and academic information at {instituteName}.
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-8">
            <section className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p>
                This Privacy Policy describes how we collect, use, and protect your information when you use our Coaching Management System (“Platform”). This platform is designed to manage student records, fee payments, teacher activities, and administrative operations. 
              </p>
              <p>By using our services, you agree to the collection and use of information in accordance with this policy.</p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm mr-3">2</span>
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">a) Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Student name, contact details, address</li>
                    <li>Parent/guardian details</li>
                    <li>Teacher and staff information</li>
                    <li>Login credentials (email, password)</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">b) Financial Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Fee payment details (transaction ID, payment status)</li>
                    <li>Payment method (processed via secure third-party gateways)</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">c) Usage Data</h3>
                <p className="text-sm">Includes login activity, system interactions, and device/browser information collected automatically during your visit.</p>
              </div>
            </section>

            <section className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
              <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                {[
                  'Manage student admissions and records',
                  'Process fee payments securely',
                  'Track academic progress and attendance',
                  'Enable student-teacher communication',
                  'Improve system functionality',
                  'Ensure platform security'
                ].map((text, i) => (
                  <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mr-3 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Data Sharing & Security</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] mr-3 shrink-0 font-bold">✓</div>
                    <p className="text-sm leading-relaxed">We do not sell or rent personal data to third parties.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] mr-3 shrink-0 font-bold">✓</div>
                    <p className="text-sm leading-relaxed">Data shared only with trusted payment gateways for processing.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] mr-3 shrink-0 font-bold">✓</div>
                    <p className="text-sm leading-relaxed">Industry-standard encryption and security measures implemented.</p>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Data Retention</h2>
                <p className="text-sm leading-relaxed">
                  We retain data only as long as necessary for operational purposes, legal compliance, and institutional record-keeping requirements.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
               <div className="relative z-10 space-y-6">
                 <h2 className="text-3xl font-bold mb-4">6. User Rights</h2>
                 <p className="opacity-80">Users have the right to access their data, request correction of incorrect information, and request deletion subject to legal and institutional obligations.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                    <div className="flex items-center space-x-3">
                       <MapPin className="text-blue-400" size={20} />
                       <span className="text-sm opacity-70 whitespace-pre-line">{settings.address || 'Address not set'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                       <Mail className="text-blue-400" size={20} />
                       <span className="text-sm opacity-70">{settings.email || 'contact@nexuscms.edu'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                       <Phone className="text-blue-400" size={20} />
                       <span className="text-sm opacity-70">{settings.phone || '+91 9876543210'}</span>
                    </div>
                 </div>
               </div>
            </section>

            <div className="text-center pt-8 border-t dark:border-gray-800">
               <p className="text-sm text-gray-500 italic">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t dark:border-gray-800 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} {instituteName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
