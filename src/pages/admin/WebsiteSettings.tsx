import React, { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Inbox, Server, Key, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminWebsiteSettings() {
  const [formData, setFormData] = useState({
    institute_name: '',
    phone: '',
    email: '',
    address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    contact_form_email: '',
    smtp_host: '',
    email_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const [showAppPasswordHelp, setShowAppPasswordHelp] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData({
            institute_name: data.institute_name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            facebook_url: data.facebook_url || '',
            twitter_url: data.twitter_url || '',
            instagram_url: data.instagram_url || '',
            linkedin_url: data.linkedin_url || '',
            contact_form_email: data.contact_form_email || '',
            smtp_host: data.smtp_host || '',
            email_password: data.email_password || ''
          });
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error saving settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold obsidian-text-gradient tracking-tight mb-2">Website Settings</h1>
          <p className="text-gray-400 text-lg font-medium opacity-80">Manage public-facing information and global configurations.</p>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-8 right-8 z-[100] px-8 py-4 obsidian-gradient text-white rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10"
          >
            <div className="bg-white/20 p-2 rounded-xl">
              <Save size={20} />
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-[10px]">System Notification</p>
              <p className="text-sm font-bold">Settings Updated Successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Core Info */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-obsidian-container-high/60 rounded-xl">
              <Globe size={20} className="text-obsidian-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">General Information</h2>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Institute Full Name</label>
            <input
              type="text"
              value={formData.institute_name}
              onChange={(e) => setFormData({...formData, institute_name: e.target.value})}
              className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
              placeholder="e.g. NexusCMS Coaching"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Contact Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                placeholder="contact@institute.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-5 text-gray-500" size={18} />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 resize-none h-28"
                placeholder="123 Education Lane..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-obsidian-container-high/60 rounded-xl">
                <Inbox size={20} className="text-obsidian-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Contact Form Setup</h2>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Receiving Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.contact_form_email}
                  onChange={(e) => setFormData({...formData, contact_form_email: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  placeholder="Where should contact form submissions go?"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 font-medium ml-1">Landing page form submissions will be forwarded here.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">SMTP Host Name</label>
              <div className="relative">
                <Server className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.smtp_host}
                  onChange={(e) => setFormData({...formData, smtp_host: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  placeholder="e.g. smtp.gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Email App Password</label>
              <div className="relative">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={formData.email_password}
                  onChange={(e) => setFormData({...formData, email_password: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 font-mono"
                  placeholder="••••••••••••••••"
                />
              </div>
              <button 
                type="button" 
                onClick={() => setShowAppPasswordHelp(true)}
                className="mt-3 text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center ml-1"
              >
                <Info size={14} className="mr-1" /> How to get an App Password?
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 flex-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-obsidian-container-high/60 rounded-xl">
                <Globe size={20} className="text-obsidian-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Social Media Links</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Facebook className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 text-sm"
                  placeholder="Facebook URL"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 text-sm"
                  placeholder="Twitter URL"
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 text-sm"
                  placeholder="Instagram URL"
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 text-sm"
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="col-span-1 xl:col-span-2 text-red-400 font-bold text-sm text-center">{error}</p>}
        
        <div className="col-span-1 xl:col-span-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-10 py-5 obsidian-gradient text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-3 text-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : <Save size={24} />}
            <span>Update Global Configuration</span>
          </button>
        </div>
      </form>

      {/* App Password Help Modal */}
      {showAppPasswordHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-surface/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-lg rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-8 pb-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-2xl font-black text-white flex items-center">
                <Key className="mr-3 text-obsidian-primary" /> Gmail App Password
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAppPasswordHelp(false)} 
                className="p-2 bg-obsidian-container-high rounded-xl text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                To allow NexusCMS to securely send emails (like contact form submissions or OTPs) on your behalf, you need to generate a dedicated "App Password" from your Google account.
              </p>
              
              <ol className="space-y-4 list-decimal list-inside text-gray-300 text-sm leading-relaxed marker:font-bold marker:text-obsidian-primary">
                <li>Go to your <a href="https://myaccount.google.com/security" target="_blank" className="text-blue-400 hover:text-blue-300 underline font-medium">Google Account Security page</a>.</li>
                <li>Make sure <strong>2-Step Verification</strong> is turned <span className="text-green-400 font-bold">ON</span>.</li>
                <li>Search for <strong>"App passwords"</strong> in the security settings search bar.</li>
                <li>Create a newly named app (e.g., "NexusCMS Mailer") and click <strong>Create</strong>.</li>
                <li>Google will show a <strong>16-character code</strong>. Copy that code exactly as it is (without spaces) and paste it here!</li>
              </ol>

              <button 
                type="button" 
                onClick={() => setShowAppPasswordHelp(false)} 
                className="w-full mt-4 py-4 obsidian-gradient text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all outline-none"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
