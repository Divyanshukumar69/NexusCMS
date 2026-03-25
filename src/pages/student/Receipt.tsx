import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Printer, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentReceipt() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!paymentId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/receipt/${paymentId}`);
        if (res.ok) {
          const data = await res.json();
          setPayment(data);
          setStudent({
            name: data.student_name,
            student_id: data.student_code,
            mobile: data.mobile,
            email: data.email
          });
          setCourse({
            name: data.course_name,
            duration_months: data.duration_months
          });
        }
      } catch (err) {
        console.error('Error fetching receipt data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!payment || !student) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Receipt Not Found</h2>
        <button onClick={() => navigate('/pay')} className="mt-4 text-blue-600 dark:text-blue-400 font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 py-12 px-6 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
            >
              <Printer size={18} className="mr-2" /> Print
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              <Download size={18} className="mr-2" /> Download PDF
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 print:shadow-none print:border-none">
          {/* Branded Header */}
          <div className="bg-blue-600 dark:bg-blue-700 p-10 text-white flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap size={40} />
                <span className="text-3xl font-bold tracking-tight">NexusCMS</span>
              </div>
              <p className="text-blue-100 dark:text-blue-200 max-w-xs text-sm">
                123 Excellence Plaza, Knowledge Park,<br />
                New Delhi, India - 110001
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold mb-4 uppercase tracking-widest">
                <CheckCircle size={14} className="mr-2" /> PAYMENT SUCCESSFUL
              </div>
              <p className="text-blue-100 dark:text-blue-200 text-xs">Receipt No: {(payment.id || '').toString().slice(-8).toUpperCase()}</p>
              <p className="text-blue-100 dark:text-blue-200 text-xs">Date: {payment.created_at ? format(new Date(payment.created_at), 'MMM dd, yyyy') : 'N/A'}</p>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Bill To</h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Student ID: {student.student_id}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{student.mobile}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{student.email}</p>
              </div>
              <div className="text-right">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Course Details</h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{course?.name}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Duration: {course?.duration_months} Months</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 dark:border-gray-800 py-8 mb-8">
              <div className="flex justify-between items-center mb-4 px-6">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Description</span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Amount</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gray-50 dark:bg-gray-800/50 px-6 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Monthly Tuition Fee</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For the current billing cycle</p>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">₹{payment.amount}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{payment.amount}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Tax (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total Paid</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{payment.amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Payment Method</h3>
                <p className="text-gray-900 dark:text-white font-bold">{payment.mode}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Transaction ID: {payment.razorpay_payment_id}</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-12 border-b border-gray-300 dark:border-gray-700 mb-2"></div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">Authorized Signatory</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              This is a computer-generated receipt and does not require a physical signature.<br />
              Thank you for choosing NexusCMS Coaching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
