import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CreditCard, LogOut, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    window.dispatchEvent(new Event('storage'));
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Website', path: '/admin/website', icon: Globe },
  ];

  return (
    <div className="flex h-screen bg-obsidian-surface text-gray-200 font-inter">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-xl border border-white/10 shadow-xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 glass-sidebar border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8">
            <h1 className="text-3xl font-bold obsidian-text-gradient tracking-tighter font-manrope">NexusCMS</h1>
            <p className="text-[10px] text-obsidian-primary/60 mt-2 uppercase tracking-[0.3em] font-extrabold">Institute Management</p>
          </div>

          <nav className="flex-1 px-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative group flex items-center px-6 py-4 rounded-2xl transition-all duration-500
                    ${isActive 
                      ? 'text-white' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon 
                    size={22} 
                    className={`
                      mr-5 transition-all duration-500 group-hover:scale-125
                      ${isActive ? 'text-obsidian-primary drop-shadow-[0_0_8px_rgba(0,122,255,0.4)]' : ''}
                    `} 
                  />
                  <span className={`text-sm font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white' : ''}`}>
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-pill"
                      className="absolute left-0 w-1.5 h-8 bg-obsidian-primary rounded-r-full shadow-[0_0_20px_rgba(0,122,255,0.6)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto border-t border-white/5">
            <div className="flex items-center mb-8 px-4 py-3 bg-obsidian-container-high/40 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full obsidian-gradient flex items-center justify-center font-bold text-white shadow-lg mr-3">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Super User</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-5 py-4 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all group font-extrabold tracking-wider text-xs"
            >
              <LogOut size={20} className="mr-4 group-hover:rotate-12 transition-transform" />
              SYSTEM LOGOUT
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 overflow-y-auto p-6 lg:p-12 scroll-smooth bg-[radial-gradient(circle_at_50%_0%,_#131a21_0%,_#090f14_100%)]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
