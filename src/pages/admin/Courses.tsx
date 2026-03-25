import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, BookOpen, IndianRupee, Users, Clock, Upload, AlertTriangle, Layers, Calendar, Search, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    monthly_fee: 0,
    book_fee: 0,
    duration_months: 12,
    seats: 60,
    image_url: ''
  });

  const [showToast, setShowToast] = useState(false);

  const loadCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData({ name: '', monthly_fee: 0, book_fee: 0, duration_months: 12, seats: 60, image_url: '' });
        loadCourses();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setError(data.details || data.error || 'The institutional server rejected this operation.');
      }
    } catch (err: any) {
      console.error('Error saving course:', err);
      setError('Neural connection failure. Check backend service status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (courseToDelete) {
      try {
        const res = await fetch(`/api/courses/${courseToDelete}`, { method: 'DELETE' });
        if (res.ok) {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
          loadCourses();
        }
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold obsidian-text-gradient tracking-tight mb-2">Program Catalog</h1>
          <p className="text-gray-400 text-lg font-medium opacity-80">Design and manage your institute's academic curriculum.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              setEditingCourse(null);
              setFormData({ name: '', monthly_fee: 0, book_fee: 0, duration_months: 12, seats: 60, image_url: '' });
              setIsModalOpen(true);
            }}
            className="px-6 py-3 obsidian-gradient text-white rounded-2xl font-bold flex items-center shadow-lg shadow-obsidian-primary/20 hover:scale-105 transition-all"
          >
            <Plus size={20} className="mr-2" />
            Create Program
          </button>
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
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-[10px]">Registry Update</p>
              <p className="text-sm font-bold">Program Record Synchronized Successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card group rounded-[2.5rem] overflow-hidden border border-white/5 hover:bg-obsidian-container-high/40 transition-all duration-700 flex flex-col h-full shadow-2xl"
            >
              {/* Image Header */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={course.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop'} 
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 grayscale hover:grayscale-0 transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-container to-transparent"></div>
                <div className="absolute top-4 left-4 p-3 bg-obsidian-container-high/80 backdrop-blur-md rounded-2xl border border-white/10">
                  <BookOpen size={20} className="text-obsidian-primary" />
                </div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-black text-white tracking-tight">{course.name}</h3>
                </div>
              </div>

              {/* Course Body */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-obsidian-container-low rounded-2xl border border-white/5 group-hover:border-obsidian-primary/20 transition-colors">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 items-center flex"><IndianRupee size={10} className="mr-1" /> Tuition</p>
                    <p className="text-xl font-black text-white">₹{course.monthly_fee}<span className="text-[10px] text-gray-400 font-bold">/mo</span></p>
                  </div>
                  <div className="p-4 bg-obsidian-container-low rounded-2xl border border-white/5 group-hover:border-obsidian-primary/20 transition-colors">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 items-center flex"><Layers size={10} className="mr-1" /> Material</p>
                    <p className="text-xl font-black text-white">₹{course.book_fee}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <Clock size={14} className="mr-2 text-obsidian-primary" /> {course.duration_months} Months
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <Users size={14} className="mr-2 text-obsidian-primary" /> {course.seats} Seats Cap
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center italic text-[10px] text-gray-500 font-medium">
                    Program ID: {course.id.slice(0, 8)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingCourse(course);
                        setFormData({
                          name: course.name,
                          monthly_fee: course.monthly_fee,
                          book_fee: course.book_fee,
                          duration_months: course.duration_months,
                          seats: course.seats,
                          image_url: course.image_url
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-3 bg-obsidian-container-high rounded-xl border border-white/5 text-gray-500 hover:text-obsidian-primary transition-all shadow-inner"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setCourseToDelete(course.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-3 bg-obsidian-container-high rounded-xl border border-white/5 text-gray-500 hover:text-red-400 transition-all shadow-inner"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="py-32 text-center glass-card rounded-[3rem] border border-white/5">
          <BookOpen size={48} className="text-gray-600 mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-white mb-2 font-manrope">Empty Curriculum</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Build your first academic program to start enrolling students.</p>
        </div>
      )}

      {/* Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-surface/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-10 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white font-manrope">
                  {editingCourse ? 'Update Program' : 'New Program'}
                </h3>
                <p className="text-gray-500 font-bold text-sm tracking-wide">Configure course pricing and duration.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-obsidian-container-high rounded-2xl text-gray-500"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold"
                >
                  <ShieldAlert size={16} className="mr-3 shrink-0" />
                  {error}
                </motion.div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Program Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Full Stack Mastery"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40 focus:bg-obsidian-container-high"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Banner Image Upload</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="course-image-upload"
                    />
                    <label
                      htmlFor="course-image-upload"
                      className="flex items-center justify-center w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 border-dashed rounded-2xl text-gray-400 hover:text-white hover:border-obsidian-primary/40 focus:ring-2 focus:ring-obsidian-primary/40 cursor-pointer transition-all"
                    >
                      {formData.image_url ? (
                        <div className="flex flex-col items-center">
                          <img src={formData.image_url} alt="Preview" className="h-24 object-cover rounded shadow-lg mb-2" />
                          <span className="text-xs">Change Image</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={20} className="mr-2" />
                          Click to Upload
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Monthly Tuition (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.monthly_fee || ''}
                    onChange={(e) => setFormData({ ...formData, monthly_fee: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Course Material (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.book_fee || ''}
                    onChange={(e) => setFormData({ ...formData, book_fee: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Duration (Months)</label>
                  <input
                    required
                    type="number"
                    value={formData.duration_months || ''}
                    onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Student Capacity</label>
                  <input
                    required
                    type="number"
                    value={formData.seats || ''}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-obsidian-container-high/40 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-obsidian-primary/40"
                  />
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-obsidian-container-high text-gray-400 font-bold rounded-2xl border border-white/5 transition-all">Discard</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-2 py-4 obsidian-gradient text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                  <span>{editingCourse ? 'Verify & Update' : 'Initialize Program'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-surface/60 backdrop-blur-xl">
          <div className="glass-card p-10 rounded-[2.5rem] w-full max-w-md border border-red-500/20 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white text-center font-manrope">Remove Program?</h3>
            <p className="text-gray-500 text-center mt-3 mb-10 font-medium">This will remove the program from the catalog permanently.</p>
            <div className="flex space-x-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-obsidian-container-high text-gray-400 font-bold rounded-2xl">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
