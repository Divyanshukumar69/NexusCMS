import { useState, useEffect } from 'react';
import { 
  Users, BookOpen, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, 
  AlertCircle, CheckCircle, Plus, Send, FileText, Settings, 
  Calendar, Clock, MoreVertical, Search, Filter, Download,
  MessageSquare, Wallet, GraduationCap, BarChart3, PieChart as PieChartIcon,
  UserCircle, Phone, Mail
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['#007aff', '#0070eb', '#85adff', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState<'revenue' | 'enrollments'>('revenue');
  const [stats, setStats] = useState({
    totalRevenueMTD: 0,
    pendingDues: 0,
    activeStudents: 0,
    overdueStudents: 0,
    todayPayments: 0,
    collectionRate: 0,
  });

  const [charts, setCharts] = useState({
    revenueDaily: [] as any[],
    duesByCourse: [] as any[],
    collectionTrend: [] as any[],
    studentStatus: [] as any[],
  });

  const [lists, setLists] = useState({
    recentStudents: [] as any[],
    recentLeads: [] as any[],
    overdueTop10: [] as any[],
    todayPaymentsLog: [] as any[],
    feeSnapshot: [] as any[],
  });

  useEffect(() => {
    const loadDashboardData = async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const [statsRes, studentsRes, paymentsRes, coursesRes, leadsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/students'),
          fetch('/api/payments'),
          fetch('/api/courses'),
          fetch('/api/leads')
        ]);

        const statsData = (await statsRes.json()) || {};
        const studentsData = (await studentsRes.json()) || [];
        const paymentsData = (await paymentsRes.json()) || [];
        const coursesData = (await coursesRes.json()) || [];
        const leadsData = (await leadsRes.json()) || [];

        const sArr = Array.isArray(studentsData) ? studentsData : [];
        const pArr = Array.isArray(paymentsData) ? paymentsData : [];
        const lArr = Array.isArray(leadsData) ? leadsData : [];

        setStats({
          totalRevenueMTD: parseFloat(statsData?.mtd_revenue || 0),
          pendingDues: parseFloat(statsData?.pending_dues || 0),
          activeStudents: parseInt(statsData?.active_students || 0),
          overdueStudents: parseInt(statsData?.overdue_students || 0),
          todayPayments: parseFloat(statsData?.today_revenue || 0),
          collectionRate: (statsData?.pending_dues > 0) 
            ? Math.round((parseFloat(statsData.mtd_revenue) / (parseFloat(statsData.mtd_revenue) + parseFloat(statsData.pending_dues))) * 100) 
            : 100
        });

        setLists({
          recentStudents: sArr.slice(0, 5),
          recentLeads: lArr.slice(0, 5),
          overdueTop10: sArr.filter((s: any) => s.status === 'Overdue').slice(0, 10),
          todayPaymentsLog: pArr.filter((p: any) => p.status === 'Success').slice(0, 8),
          feeSnapshot: coursesData
        });

        // Past 14 Days Aggregation
        const last14Days = Array.from({ length: 14 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return format(d, 'MMM dd');
        }).reverse();

        const dailyRev = last14Days.map(day => ({
          name: day,
          revenue: pArr
            .filter((p: any) => p.status === 'Success' && format(new Date(p.created_at), 'MMM dd') === day)
            .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0),
          enrollments: sArr
            .filter((s: any) => format(new Date(s.created_at), 'MMM dd') === day)
            .length
        }));

        setCharts({
          revenueDaily: dailyRev,
          duesByCourse: [],
          collectionTrend: [],
          studentStatus: [
            { name: 'Active', value: parseInt(statsData?.active_students || 0) },
            { name: 'Overdue', value: parseInt(statsData?.overdue_students || 0) }
          ]
        });

      } catch (error) {
        console.error('Telemetric system failure:', error);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    loadDashboardData();
    const poller = setInterval(() => loadDashboardData(true), 30000); // Poll every 30s
    return () => clearInterval(poller);
  }, []);

  const handleSendReminders = async () => {
    if (!confirm('This will send overdue email reminders to all flagged students. Continue?')) return;
    
    try {
      const res = await fetch('/api/send-reminders', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Success! Dispatched ${data.count} reminder emails out of ${data.total} overdue students.`);
      } else {
        alert('Failed to dispatch reminders: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while sending reminders.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-obsidian-surface">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-obsidian-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 obsidian-gradient rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { name: 'Revenue (MTD)', value: `₹${stats.totalRevenueMTD.toLocaleString()}`, icon: Wallet, trend: '+12.5%', color: 'text-obsidian-primary' },
    { name: 'Pending Dues', value: `₹${stats.pendingDues.toLocaleString()}`, icon: AlertCircle, trend: 'Action Required', color: 'text-red-400' },
    { name: 'Active Students', value: stats.activeStudents, icon: Users, trend: 'Stable', color: 'text-obsidian-primary' },
    { name: 'Overdue Admissions', value: stats.overdueStudents, icon: Clock, trend: 'Immediate Follow-up', color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Editorial Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-6 border-b border-outline-variant">
        <div>
          <h1 className="text-4xl md:text-6xl font-black obsidian-text-gradient tracking-tight mb-3">Institutional Overview</h1>
          <p className="text-on-surface-variant text-lg font-medium opacity-80 max-w-2xl leading-relaxed">
            Live telemetry from academic enrollments and fiscal performance. Data is refreshed every 5 minutes.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center px-6 py-3 bg-obsidian-container-high/40 rounded-2xl border border-outline-variant text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 animate-pulse"></span>
            Server Connection Live
          </div>
          <button 
            onClick={handleSendReminders}
            className="premium-button flex items-center shadow-lg group"
          >
            <Send size={18} className="mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Automate Reminders
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="p-4 bg-obsidian-container-high hover:bg-obsidian-primary/10 rounded-2xl border border-outline-variant text-on-surface-variant hover:text-obsidian-primary transition-all shadow-inner group"
          >
            <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Hero Stats - Editorial Carousel */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex xl:grid xl:grid-cols-4 gap-6 min-w-max xl:min-w-0 pb-4">
          {kpiCards.map((card, idx) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 w-[320px] xl:w-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 obsidian-gradient opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-700"></div>
              <div className="flex items-start justify-between mb-10">
                <div className="p-5 bg-obsidian-container-high rounded-[1.5rem] border border-outline-variant shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <card.icon className={card.color} size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 rounded-full text-on-surface-variant">
                  {card.trend}
                </span>
              </div>
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">{card.name}</h3>
              <p className="text-5xl font-black text-white tracking-tighter font-manrope">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-card p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Financial Performance</h2>
              <p className="text-sm text-gray-500">{chartTab === 'revenue' ? 'Revenue trend' : 'New admissions'} for the past 14 days</p>
            </div>
            <div className="flex bg-obsidian-container-high rounded-xl p-1 border border-white/5">
              <button 
                onClick={() => setChartTab('revenue')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  chartTab === 'revenue' ? 'obsidian-gradient text-white shadow-lg shadow-obsidian-primary/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Revenue
              </button>
              <button 
                onClick={() => setChartTab('enrollments')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  chartTab === 'enrollments' ? 'obsidian-gradient text-white shadow-lg shadow-obsidian-primary/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Enrollments
              </button>
            </div>
          </div>
          
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueDaily}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartTab === 'revenue' ? '#007aff' : '#a855f7'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartTab === 'revenue' ? '#007aff' : '#a855f7'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={chartTab === 'revenue' ? ((val) => `₹${val}`) : ((val) => String(val))}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: chartTab === 'revenue' ? '#85adff' : '#d8b4fe', fontWeight: 700 }}
                />
                <Area 
                  key={chartTab}
                  type="monotone" 
                  dataKey={chartTab} 
                  stroke={chartTab === 'revenue' ? "#007aff" : "#a855f7"}
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-1 self-start">Student Status</h2>
          <p className="text-sm text-gray-500 mb-10 self-start">Current admission breakdown</p>
          
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.studentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {charts.studentStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-4xl font-black text-white tracking-tighter">{stats.activeStudents + stats.overdueStudents}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Students</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 w-full mt-6">
            <div className="p-4 bg-obsidian-container-high/40 rounded-2xl border border-white/5">
              <div className="flex items-center text-xs font-bold text-gray-500 uppercase mb-2">
                <div className="w-2 h-2 rounded-full bg-obsidian-primary mr-2"></div>
                Active
              </div>
              <p className="text-xl font-bold text-white">{stats.activeStudents}</p>
            </div>
            <div className="p-4 bg-obsidian-container-high/40 rounded-2xl border border-white/5">
              <div className="flex items-center text-xs font-bold text-gray-500 uppercase mb-2">
                <div className="w-2 h-2 rounded-full bg-obsidian-primary-dim mr-2"></div>
                Overdue
              </div>
              <p className="text-xl font-bold text-white">{stats.overdueStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Students Table */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
          <div className="p-10 pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Enrollments</h2>
            <button 
              onClick={() => navigate('/admin/students')}
              className="text-obsidian-primary hover:text-obsidian-primary-bright font-bold text-sm transition-colors px-4 py-2 bg-obsidian-primary/10 rounded-xl"
            >
              View All
            </button>
          </div>
          <div className="px-6 pb-10">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[500px]">
                <tbody>
                  {lists.recentStudents.map((student: any) => (
                    <tr key={student.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <td className="py-5 px-4 first:pl-0 last:pr-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-2xl obsidian-gradient text-white flex items-center justify-center font-bold text-lg shadow-lg shrink-0">
                            {student.name[0]}
                          </div>
                          <div className="ml-4 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:obsidian-text-gradient transition-all truncate">{student.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{student.course_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-400 block mb-1">Fee Plan</span>
                        <span className="text-sm font-black text-obsidian-primary">₹{Math.round(Number(student.monthly_fee) || 0)}/m</span>
                      </td>
                    </tr>
                  ))}
                  {lists.recentStudents.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-20 text-center text-gray-500 font-medium italic">No recent admissions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Leads Section */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
        <div className="p-10 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">New Admission Inquiries</h2>
            <p className="text-sm text-gray-500">Latest applications from "Apply Now"</p>
          </div>
          <div className="px-4 py-2 bg-obsidian-primary/10 rounded-xl text-obsidian-primary text-xs font-bold uppercase tracking-widest">
            {lists.recentLeads.length} Potentials
          </div>
        </div>
        <div className="px-8 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.recentLeads.map((lead: any) => (
              <div key={lead.id} className="p-8 bg-obsidian-container-low hover:bg-obsidian-container-high transition-all rounded-[2rem] border border-white/5 group shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <UserCircle size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${lead.status === 'New' ? 'bg-obsidian-primary/20 text-obsidian-primary' : 'bg-white/5 text-gray-500'}`}>
                    {lead.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:obsidian-text-gradient transition-all">{lead.name}</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                  <BookOpen size={14} className="mr-2" />
                  {lead.course_name || 'General Inquiry'}
                </p>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center text-xs font-medium text-gray-400">
                    <Phone size={14} className="mr-3 text-obsidian-primary" />
                    {lead.phone}
                  </div>
                  <div className="flex items-center text-xs font-medium text-gray-400">
                    <Mail size={14} className="mr-3 text-obsidian-primary" />
                    {lead.email || 'No email provided'}
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-obsidian-container-high group-hover:bg-obsidian-primary group-hover:text-white text-gray-400 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-inner">
                  Assign & Contact
                </button>
              </div>
            ))}
            {lists.recentLeads.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 font-medium italic">No new admission inquiries at the moment.</div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Developer Support Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-12 mt-16 flex flex-col items-center text-center space-y-8 bg-obsidian-primary/5 border border-obsidian-primary/20"
      >
        <div className="p-5 bg-obsidian-primary/10 rounded-[1.5rem] border border-obsidian-primary/20 shadow-glow">
          <Phone size={32} className="text-obsidian-primary rotate-12" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4">Institutional Support</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto font-medium leading-relaxed">
            Contact the developer to <span className="text-white font-bold underline decoration-obsidian-primary underline-offset-4 tracking-wide">modify root passwords</span> or core system metrics. 
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl px-4">
          <a 
            href="https://api.whatsapp.com/send/?phone=919798263469&text=Hello%20From%20NexusCMS&type=phone_number&app_absent=0" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full sm:w-auto h-16 flex items-center justify-center space-x-4 bg-[#25D366] hover:bg-[#1da851] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl hover:scale-[1.05]"
          >
            <MessageSquare size={20} />
            <span>Developer Whatsapp</span>
          </a>
          <a 
            href="tel:9264295306"
            className="flex-1 w-full sm:w-auto h-16 flex items-center justify-center space-x-4 bg-obsidian-container-high hover:bg-white text-gray-500 hover:text-obsidian-surface rounded-[1.5rem] border border-outline-variant font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl hover:scale-[1.05]"
          >
            <Phone size={20} />
            <span>Direct Signal Hub</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
