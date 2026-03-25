import React, { useState } from 'react';
import { Eye, EyeOff, Calendar, MessageSquare, User, Bell, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Mockup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#050A05] text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background Pattern - Swirling topological lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500" stroke="#00FF00" fill="none" strokeWidth="2" />
          <path d="M0,300 C200,200 300,400 500,300 C700,200 800,400 1000,300" stroke="#00FF00" fill="none" strokeWidth="1" />
          <path d="M0,700 C200,600 300,800 500,700 C700,600 800,800 1000,700" stroke="#00FF00" fill="none" strokeWidth="1" />
          <circle cx="500" cy="500" r="300" stroke="#00FF00" fill="none" strokeWidth="0.5" opacity="0.5" />
          <circle cx="500" cy="500" r="400" stroke="#00FF00" fill="none" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-12 py-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#FFB800] rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rotate-45"></div>
          </div>
          <span className="text-2xl font-black tracking-tighter italic">Coach.io</span>
        </div>

        <nav className="hidden md:flex items-center space-x-12 text-xs font-bold tracking-[0.2em] opacity-70">
          <a href="#" className="hover:text-[#FFB800] transition-colors">STUDENTS</a>
          <a href="#" className="hover:text-[#FFB800] transition-colors">SCHEDULE</a>
          <a href="#" className="hover:text-[#FFB800] transition-colors">SUPPORT</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 w-full gap-12 items-center">
          
          {/* Left Section: Login */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Username</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="coach.id@example.com"
                    className="w-full bg-[#0A150A] border-b-2 border-gray-800 py-4 px-0 outline-none focus:border-[#FFB800] transition-all placeholder:text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full bg-[#0A150A] border-b-2 border-gray-800 py-4 px-0 outline-none focus:border-[#FFB800] transition-all placeholder:text-gray-700 font-medium"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FFB800]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-4 h-4 border-2 border-gray-800 rounded-sm group-hover:border-[#FFB800] flex items-center justify-center transition-colors">
                    <div className="w-2 h-2 bg-[#FFB800] scale-0 group-hover:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-gray-500 group-hover:text-gray-300">Remember me</span>
                  <input type="checkbox" className="hidden" />
                </label>
                <a href="#" className="text-[#FFB800] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button className="w-full py-5 bg-[#FFB800] text-black font-black text-sm uppercase tracking-[0.3em] rounded-full shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:shadow-[0_0_50px_rgba(255,184,0,0.5)] hover:scale-[1.02] active:scale-95 transition-all">
              Log In
            </button>
          </motion.div>

          {/* Right Section: Avatar & Welcome */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-8"
          >
            <div className="relative">
              {/* Outer Glow Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#FFB800] opacity-20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full border border-[#FFB800] opacity-10"></div>
              
              {/* Avatar Frame */}
              <div className="w-64 h-64 lg:w-96 lg:h-96 rounded-full border-8 border-[#FFB800] p-2 relative overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-4 border-black">
                  <img 
                    src="https://picsum.photos/seed/yami/800/800" 
                    alt="Yami Sukehiro Portrait"
                    className="w-full h-full object-cover grayscale brightness-75 contrast-125 hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay for anime effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                {/* Black Bulls Logo Placeholder */}
                <div className="absolute bottom-8 right-8 w-16 h-16 bg-black border-2 border-[#FFB800] rounded-lg rotate-12 flex items-center justify-center shadow-xl">
                  <Hexagon className="text-[#FFB800]" fill="currentColor" size={32} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none">
                WELCOME <span className="text-[#FFB800]">COACH!</span>
              </h2>
              <p className="text-gray-500 font-bold tracking-widest text-sm max-w-xs lg:ml-auto">
                Access your student dashboard and schedule.
              </p>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Extreme Right Sidebar: Social Icons */}
      <aside className="fixed right-0 top-0 bottom-0 w-20 border-l border-gray-900 flex flex-col items-center justify-center space-y-8 z-20 bg-black/20 backdrop-blur-sm">
        {[Calendar, MessageSquare, User, Bell].map((Icon, i) => (
          <button key={i} className="w-12 h-12 rounded-full border-2 border-[#FFB800] flex items-center justify-center text-[#FFB800] hover:bg-[#FFB800] hover:text-black transition-all group">
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </aside>

      {/* Footer */}
      <footer className="relative z-10 px-12 py-12 flex flex-col items-center lg:items-start">
        <div className="flex flex-col items-center lg:items-start space-y-2">
          <div className="flex items-center space-x-2">
            <Hexagon className="text-[#FFB800]" size={24} fill="currentColor" />
            <span className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase">Platform Design</span>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-gray-600 uppercase mt-4">
            Created By - Divyanshu Kumar
          </p>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-20"></div>
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#00FF00] rounded-full blur-[150px] opacity-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#FFB800] rounded-full blur-[150px] opacity-5"></div>
    </div>
  );
}
