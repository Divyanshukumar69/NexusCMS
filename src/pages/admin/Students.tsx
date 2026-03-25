import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, UserPlus, Phone, Mail, BookOpen, Calendar, AlertTriangle, Download, Filter, MoreHorizontal, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    mobile: '',
    email: '',
    course_id: '',
    join_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Active'
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const loadData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/courses')
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      setStudents(Array.isArray(sData) ? sData : []);
      setCourses(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
      setCourses([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStudent ? 'PUT' : 'POST';
      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingStudent(null);
        setFormData({ student_id: '', name: '', mobile: '', email: '', course_id: '', join_date: format(new Date(), 'yyyy-MM-dd'), status: 'Active' });
        loadData();
      }
    } catch (err) {
      console.error('Error saving student:', err);
    }
  };

  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        const res = await fetch(`/api/students/${studentToDelete}`, { method: 'DELETE' });
        if (res.ok) {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
          loadData();
        }
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || student.status === statusFilter;
    const matchesCourse = courseFilter === '' || student.course_id === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (courseFilter) params.append('course_id', courseFilter);
    
    window.location.href = `/api/students/export?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold obsidian-text-gradient tracking-tight mb-2">Student Directory</h1>
          <p className="text-gray-400 text-lg font-medium opacity-80">Manage institution admissions and student records.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              setEditingStudent(null);
              setFormData({ student_id: '', name: '', mobile: '', email: '', course_id: '', join_date: format(new Date(), 'yyyy-MM-dd'), status: 'Active' });
              setIsModalOpen(true);
            }}
            className="px-6 py-3 obsidian-gradient text-white rounded-2xl font-bold flex items-center shadow-lg shadow-obsidian-primary/20 hover:scale-105 transition-all"
          >
            <UserPlus size={20} className="mr-2" />
            Add Admission
          </button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="glass-card p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto relative">
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex-1 md:flex-none flex items-center justify-center px-6 py-3 rounded-2xl border transition-all ${isFilterPanelOpen ? 'bg-obsidian-primary/20 border-obsidian-primary text-white' : 'bg-obsidian-container-high text-gray-400 border-white/5 hover:text-white'}`}
          >
            <Filter size={18} className="mr-2" />
            Filter {(statusFilter || courseFilter) && "•"}
          </button>
          
          <AnimatePresence>
            {isFilterPanelOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-72 glass-card p-6 rounded-3xl border border-white/10 shadow-2xl z-20"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">By Status</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">By Course</label>
                    <select 
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="w-full px-4 py-2 bg-obsidian-container-high/40 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                    >
                      <option value="">All Courses</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <button 
                    onClick={() => { setStatusFilter(''); setCourseFilter(''); }}
                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-obsidian-container-high text-gray-400 rounded-2xl border border-white/5 hover:text-white transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Grid of Student Cards (Editorial View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStudents.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/5 hover:bg-obsidian-container-high/40 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl obsidian-gradient flex items-center justify-center text-white text-xl font-black shadow-xl">
                  {student.name[0]}
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => {
                      setEditingStudent(student);
                      setFormData({
                        student_id: student.student_id,
                        name: student.name,
                        mobile: student.mobile,
                        email: student.email,
                        course_id: student.course_id,
                        join_date: student.join_date,
                        status: student.status
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-obsidian-primary hover:bg-obsidian-primary/10 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      setStudentToDelete(student.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-extrabold text-white group-hover:obsidian-text-gradient transition-all">{student.name}</h3>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{student.student_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-obsidian-container-low rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Course</p>
                  <p className="text-xs font-bold text-obsidian-primary truncate">{student.course_name}</p>
                </div>
                <div className="p-3 bg-obsidian-container-low rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Joined</p>
                  <p className="text-xs font-bold text-white truncate">{format(new Date(student.join_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-xs font-semibold text-gray-400">
                  <Phone size={14} className="mr-3 text-obsidian-primary" /> {student.mobile}
                </div>
                <div className="flex items-center text-xs font-semibold text-gray-400">
                  <Mail size={14} className="mr-3 text-obsidian-primary" /> {student.email}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                  student.status === 'Active' ? 'bg-green-500/10 text-green-500' : 
                  student.status === 'Overdue' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {student.status}
                </span>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="py-32 text-center glass-card rounded-[3rem] border border-white/5">
          <div className="w-20 h-20 bg-obsidian-container-high rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Search size={32} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-manrope">No matches found</h2>
          <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search terms or adding a new student to the directory.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-surface/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full max-w-2xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-obsidian-primary/10"
          >
            <div className="p-10 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white font-manrope mb-1">
                  {editingStudent ? 'Edit Student' : 'New Admission'}
                </h3>
                <p className="text-gray-500 font-bold text-sm tracking-wide">Enter the institutional records accurately.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-obsidian-container-high rounded-2xl text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Student ID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aditya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91-0000000000"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="aditya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Select Course</label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-obsidian-container">Choose Program...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id} className="bg-obsidian-container">{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Registration Date</label>
                  <input
                    required
                    type="date"
                    value={formData.join_date}
                    onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-obsidian-container-high text-gray-400 font-bold rounded-2xl border border-white/5 hover:bg-obsidian-container-highest transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 obsidian-gradient text-white font-black rounded-2xl shadow-xl shadow-obsidian-primary/20 hover:scale-[1.02] transition-all"
                >
                  {editingStudent ? 'Verify & Save Changes' : 'Complete Admission'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-surface/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-10 rounded-[2.5rem] border border-red-500/20 shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-white text-center font-manrope mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 text-center mb-10 font-medium">Are you sure you want to delete this student? This action is permanent and cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 bg-obsidian-container-high text-gray-400 font-bold rounded-2xl border border-white/5 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
