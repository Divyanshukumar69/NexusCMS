import { useState, useEffect } from 'react';
import { Search, CreditCard, ExternalLink, Filter, Download, Plus, X, User, IndianRupee, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: 0,
    mode: 'Cash',
    notes: ''
  });

  const loadData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/students')
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      setPayments(Array.isArray(pData) ? pData : []);
      setStudents(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setPayments([]);
      setStudents([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPayments = payments.filter(p => {
    const student = students.find(s => s.id === p.student_id);
    const matchesSearch = (student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.razorpay_payment_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCollectFee = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'Success'
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ student_id: '', amount: 0, mode: 'Cash', notes: '' });
        loadData();
      }
    } catch (err) {
      console.error('Error collecting fee:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold obsidian-text-gradient tracking-tight mb-2">Financial Ledger</h1>
          <p className="text-gray-400 text-lg font-medium opacity-80">Track revenue streams and institutional fee collections.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 obsidian-gradient text-white rounded-2xl font-bold flex items-center shadow-lg shadow-obsidian-primary/20 hover:scale-105 transition-all"
          >
            <Plus size={20} className="mr-2" />
            Process Payment
          </button>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="glass-card p-6 rounded-[2rem] flex flex-col xl:flex-row gap-4 items-center border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by student name or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-obsidian-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full xl:w-auto">
          <div className="flex bg-obsidian-container-high/40 p-1 rounded-2xl border border-white/5 flex-1 xl:flex-none">
            {['All', 'Success', 'Pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                  filterStatus === status 
                    ? 'obsidian-gradient text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="p-3 bg-obsidian-container-high text-gray-400 rounded-2xl border border-white/5 hover:text-white transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Payments List (Digital Obsidian Style) */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-container-high/20">
                <th className="py-6 px-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Transaction / Student</th>
                <th className="py-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Details</th>
                <th className="py-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="py-6 px-4 text-[10px) font-black text-gray-500 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="py-6 px-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayments.map((payment, idx) => {
                const student = students.find(s => s.id === payment.student_id);
                return (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-6 px-10">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl bg-obsidian-container-high border border-white/5 flex items-center justify-center text-obsidian-primary font-bold shadow-inner">
                          {student?.name?.[0] || <User size={20} />}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-white group-hover:obsidian-text-gradient transition-all">{student?.name || 'Unknown Student'}</p>
                          <p className="text-[10px] text-gray-500 font-mono tracking-widest">{payment.razorpay_payment_id || 'OFFLINE_CASH'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center text-xs font-bold text-gray-400">
                        <CreditCard size={14} className="mr-3 text-obsidian-primary" />
                        {payment.mode}
                        <span className="mx-2 text-white/10">|</span>
                        <Calendar size={14} className="mr-2 text-gray-600" />
                        {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="py-6 px-4 text-right">
                      <p className="text-lg font-black text-white tracking-tighter">₹{payment.amount}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gross Revenue</p>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        payment.status === 'Success' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {payment.status === 'Success' ? <CheckCircle size={12} className="mr-2" /> : <Clock size={12} className="mr-2" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <button className="p-3 bg-obsidian-container-high rounded-xl border border-white/5 text-gray-500 hover:text-white transition-all group-hover:scale-110">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="py-32 text-center">
              <div className="p-6 bg-obsidian-container-high w-fit mx-auto rounded-[2rem] border border-white/5 mb-6">
                <AlertCircle size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-500 font-bold tracking-wide italic">No transaction records match your parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fee Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-surface/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-xl rounded-[3rem] overflow-hidden border border-white/10"
          >
            <div className="p-10 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white font-manrope">Collect Tuition</h3>
                <p className="text-gray-500 font-bold text-sm">Log an offline cash or bank transfer payment.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-obsidian-container-high rounded-2xl text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCollectFee} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Select Student</label>
                <select
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-5 py-4 bg-obsidian-container-high border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-obsidian-container">Choose Active Student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id} className="bg-obsidian-container">{s.name} ({s.student_id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Fee Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-primary" size={18} />
                    <input
                      required
                      type="number"
                      placeholder="5000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      className="w-full pl-12 pr-4 py-4 bg-obsidian-container-high border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Payment Method</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 appearance-none cursor-pointer"
                  >
                    <option value="Cash" className="bg-obsidian-container">Physical Cash</option>
                    <option value="Bank Transfer" className="bg-obsidian-container">Bank/UPI (Direct)</option>
                    <option value="Cheque" className="bg-obsidian-container">Institutional Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Internal Remarks</label>
                <textarea
                  placeholder="e.g. Paid for March 2026 Tuition"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-5 py-4 bg-obsidian-container-high border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 h-32"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-5 obsidian-gradient text-white font-black rounded-3xl shadow-2xl shadow-obsidian-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  GENERATE RECEIPT & LOG PAYMENT
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
