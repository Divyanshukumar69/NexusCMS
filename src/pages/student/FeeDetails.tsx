import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, CreditCard, CheckCircle, Clock, AlertCircle, Receipt, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export default function StudentFeeDetails() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      // 1. Fetch Student & Course (joined in backend)
      const sRes = await fetch(`/api/students/${studentId}`);
      if (!sRes.ok) throw new Error('Student not found');
      const studentData = await sRes.json();
      setStudent(studentData);
      setCourse({
        name: studentData.course_name,
        monthly_fee: studentData.monthly_fee,
        book_fee: studentData.book_fee,
        duration_months: studentData.duration_months
      });

      // 2. Fetch Payments
      const pRes = await fetch(`/api/payments?studentId=${studentId}`);
      const paymentsData = await pRes.json();
      setPayments(paymentsData);

    } catch (err) {
      console.error('Failed to load fee details:', err);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handlePayment = async () => {
    if (!student || !course) return;
    setPaying(true);

    try {
      // 1. Create order on server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: course.monthly_fee,
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || 'Failed to create payment order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'NexusCMS Coaching',
        description: `Monthly Fee - ${course.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.status === 'ok') {
            // 4. Save payment to PostgreSQL via API
            await fetch('/api/payments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                student_id: student.id,
                amount: course.monthly_fee,
                mode: 'UPI',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                status: 'Success'
              })
            });

            loadData(); // Refresh history

            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#2563eb', '#3b82f6', '#60a5fa']
            });
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: student.mobile,
        },
        theme: { color: '#2563eb' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Not Found</h2>
        <button onClick={() => navigate('/pay')} className="mt-4 text-blue-600 dark:text-blue-400 font-bold">Go Back</button>
      </div>
    );
  }

  const successfulPayments = payments.filter(p => p.status === 'Success');
  const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b dark:border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/pay')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600 dark:text-blue-400" size={24} />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">NexusCMS</span>
          </Link>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Home</Link>
              <Link to="/courses" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Courses</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Student Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                <User className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-widest">
                  {student.student_id}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{student.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{course?.name || 'Loading course...'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Enrollment Status</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{student.status}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Fee Summary */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <CreditCard className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
                Fee Structure
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Monthly Tuition Fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{course?.monthly_fee}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Book & Material Fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{course?.book_fee}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-900 dark:text-white font-bold">Total Paid to Date</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹{totalPaid}</span>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full mt-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
              >
                {paying ? 'Processing...' : `Pay Monthly Fee (₹${course?.monthly_fee})`}
              </button>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
                Payment History
              </h3>
              <div className="space-y-4">
                {successfulPayments.length > 0 ? (
                  successfulPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">₹{payment.amount}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {payment.created_at ? format(new Date(payment.created_at), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/receipt/${payment.id}`)}
                        className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Receipt size={14} className="mr-1" /> View Receipt
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 dark:text-gray-600">No payments found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-blue-600 dark:bg-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20">
              <h3 className="font-bold text-xl mb-4">Important Notice</h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm leading-relaxed">
                Fees must be paid by the 10th of every month. Late payments may incur a fine of ₹100 per week.
              </p>
              <div className="mt-6 pt-6 border-t border-blue-500 dark:border-blue-600">
                <p className="text-[10px] text-blue-200 dark:text-blue-300 uppercase tracking-widest">Support</p>
                <p className="font-bold mt-1">support@nexuscms.com</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                If you have any issues with the payment, please contact our support team or visit the institute office.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
