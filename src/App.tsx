import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import AdminStudents from './pages/admin/Students';
import AdminCourses from './pages/admin/Courses';
import AdminPayments from './pages/admin/Payments';
import StudentSearch from './pages/student/Search';
import StudentFeeDetails from './pages/student/FeeDetails';
import StudentReceipt from './pages/student/Receipt';
import LandingPage from './pages/LandingPage';
import Courses from './pages/Courses';
import Mockup from './pages/Mockup';
import AdminWebsiteSettings from './pages/admin/WebsiteSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Class10Details from './pages/Class10Details';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin_auth') === 'true');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for local storage changes (for admin login/logout)
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-obsidian-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-obsidian-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/course/cbse-10" element={<Class10Details />} />
        
        {/* UI Mockup Route */}
        <Route path="/mockup" element={<Mockup />} />

        {/* Student Portal */}
        <Route path="/pay" element={<StudentSearch />} />
        <Route path="/pay/:studentId" element={<StudentFeeDetails />} />
        <Route path="/receipt/:paymentId" element={<StudentReceipt />} />

        {/* Admin Portal */}
        <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
        
        <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="website" element={<AdminWebsiteSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

