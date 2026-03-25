import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';
import crypto from 'crypto';

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (user.length <= 4) return `${user[0]}***@${domain}`;
  const first = user.slice(0, 5);
  const last = user.slice(-3);
  return `${first}${'*'.repeat(8)}${last}@${domain}`;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Razorpay Initialization (Still needed for payments)
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
  });

  // PostgreSQL Pool Initialization
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // Database Initialization Logic
  const initDb = async () => {
    try {
      const client = await pool.connect();
      console.log('[DB] Synchronizing database schema...');
      
      // Website Settings initialization (as before)
      await client.query(`
        CREATE TABLE IF NOT EXISTS website_settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          institute_name VARCHAR(255) DEFAULT 'NexusCMS Coaching',
          phone VARCHAR(20),
          email VARCHAR(255),
          address TEXT,
          facebook_url TEXT,
          twitter_url TEXT,
          instagram_url TEXT,
          linkedin_url TEXT,
          contact_form_email VARCHAR(255),
          smtp_host VARCHAR(255),
          email_password TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await client.query(`
        INSERT INTO website_settings (id, institute_name) 
        VALUES (1, 'NexusCMS Coaching') 
        ON CONFLICT (id) DO NOTHING
      `);

      // Courses Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          monthly_fee DECIMAL(10,2) NOT NULL,
          duration_months INTEGER DEFAULT 12,
          level VARCHAR(50),
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Students Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          mobile VARCHAR(20) NOT NULL,
          email VARCHAR(255),
          course_id UUID REFERENCES courses(id),
          join_date DATE NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          pending_amount DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Payments Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES students(id),
          amount DECIMAL(10,2) NOT NULL,
          mode VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'Success',
          razorpay_order_id TEXT,
          razorpay_payment_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Enrollment Leads Table (High Priority for current task)
      await client.query(`
        CREATE TABLE IF NOT EXISTS enrollment_leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          parent_name VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20) NOT NULL,
          course_id UUID REFERENCES courses(id),
          message TEXT,
          address TEXT,
          previous_school TEXT,
          status VARCHAR(50) DEFAULT 'New',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('[DB] Connected and verified successfully');
      client.release();
    } catch (err: any) {
      console.error('[DB] Initialization Error:', err.message);
    }
  };

  await initDb();
  
  // Shared Transporter Function for speed & consistency
  let cachedTransporter: any = null;
  const getTransporter = async (forceRefresh = false) => {
    if (cachedTransporter && !forceRefresh) return cachedTransporter;
    const { rows: settingsRows } = await pool.query('SELECT contact_form_email, smtp_host, email_password FROM website_settings WHERE id = 1');
    const settings = settingsRows[0] || {};
    
    cachedTransporter = nodemailer.createTransport({
      service: (process.env.EMAIL_SERVICE || 'gmail').toLowerCase() === 'gmail' ? 'gmail' : undefined,
      host: (process.env.EMAIL_SERVICE || 'smtp.gmail.com').toLowerCase() !== 'gmail' ? (settings.smtp_host || process.env.EMAIL_HOST) : undefined,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || settings.contact_form_email,
        pass: process.env.EMAIL_PASS || settings.email_password,
      },
      tls: { rejectUnauthorized: false }
    });
    return cachedTransporter;
  };

  // Pre-warm the cache
  await getTransporter().catch(e => console.warn('[SMTP] Startup warmup failed:', e.message));

  // API Routes

  // API Routes

  // API Routes

  // Send Reminders to Overdue Students
  app.post('/api/send-reminders', async (req, res) => {
    try {
      const { rows: settingsRows } = await pool.query('SELECT contact_form_email, institute_name, smtp_host, email_password FROM website_settings WHERE id = 1');
      const settings = settingsRows[0] || {};
      const fromEmail = process.env.EMAIL_USER || settings.contact_form_email;
      const fromName = settings.institute_name || 'NexusCMS Coaching';

      if (!fromEmail) return res.status(400).json({ error: 'SMTP not configured' });

      // Fetch students with status Overdue and valid email
      const { rows: students } = await pool.query(`
        SELECT student_id, name, email, pending_amount 
        FROM students 
        WHERE status = 'Overdue' AND email IS NOT NULL AND email != ''
      `);
      
      if (students.length === 0) {
        return res.json({ success: true, count: 0, message: 'No overdue students found' });
      }

      const transporter = await getTransporter();

      let sentCount = 0;
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      for (const student of students) {
        try {
          await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: student.email,
            subject: '⚠️ Important: Fee Payment Reminder & Late Fee Notice',
            html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background-color: #f9fafb; color: #111827; max-width: 600px; margin: auto; border-radius: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0; font-size: 28px;">${fromName}</h1>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Student Fee Administration</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                  <h2 style="color: #ef4444; margin-top: 0;">Overdue Fee Reminder</h2>
                  <p>Hi <b>${student.name}</b>,</p>
                  <p>Our records show that your fee payment (ID: <b>${student.student_id}</b>) is currently <b>overdue</b>.</p>
                  
                  <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; color: #b91c1c;">Late Fee Policy:</p>
                    <p style="margin: 5px 0 0 0; color: #7f1d1d;">Please be advised that if you pay late, an additional fee of <b>₹100 per week</b> is applied to your balance.</p>
                  </div>
                  
                  <p>Current Pending Amount: <b style="font-size: 18px; color: #111827;">₹${student.pending_amount}</b></p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${baseUrl}/pay" style="background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px;">Pay Your Coaching Fees Now</a>
                  </div>
                  
                  <p style="font-size: 13px; color: #6b7280; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px;">
                    If you have already made the payment, please disregard this automated message. For queries, contact the administration office.
                  </p>
                </div>
                
                <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
                  &copy; ${new Date().getFullYear()} ${fromName}. All rights reserved.
                </p>
              </div>
            `
          });
          sentCount++;
        } catch (e: any) {
          console.error(`[Reminder Fail] ${student.email}:`, e.message);
        }
      }

      res.json({ success: true, count: sentCount, total: students.length });
    } catch (error: any) {
      console.error('[REMINDER_ENDPOINT_ERROR]:', error.message);
      res.status(500).json({ error: 'Failed to process reminders' });
    }
  });

  // Dashboard Stats (PostgreSQL version)
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM students WHERE status = 'Active') as active_students,
          (SELECT COUNT(*) FROM students WHERE status = 'Overdue') as overdue_students,
          (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'Success' AND created_at >= date_trunc('month', now())) as mtd_revenue,
          (SELECT COALESCE(SUM(pending_amount), 0) FROM students) as pending_dues,
          (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'Success' AND date_trunc('day', created_at) = date_trunc('day', now())) as today_revenue
      `);
      res.json(stats.rows[0]);
    } catch (error) {
      console.error('[DB] Stats Error:', error);
      res.status(500).json({ error: 'Database failed' });
    }
  });

  // Get Single Student
  app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(`
        SELECT s.*, c.name as course_name, c.monthly_fee, c.book_fee, c.duration_months 
        FROM students s 
        LEFT JOIN courses c ON s.course_id = c.id 
        WHERE s.id = $1
      `, [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch student details' });
    }
  });

  // Get All Courses
  app.get('/api/courses', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      console.error('[DB] Fetch Courses Error:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  // Create Course
  app.post('/api/courses', async (req, res) => {
    const { name, monthly_fee, book_fee, duration_months, seats, image_url } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO courses (name, monthly_fee, book_fee, duration_months, seats, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, monthly_fee, book_fee, duration_months, seats, image_url]
      );
      res.json(rows[0]);
    } catch (error: any) {
      console.error('[DB] Create Course Error:', error.message);
      res.status(500).json({ error: 'Failed to create course', details: error.message });
    }
  });

  // Update Course
  app.put('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { name, monthly_fee, book_fee, duration_months, seats, image_url } = req.body;
    try {
      const { rows } = await pool.query(
        'UPDATE courses SET name = $1, monthly_fee = $2, book_fee = $3, duration_months = $4, seats = $5, image_url = $6 WHERE id = $7 RETURNING *',
        [name, monthly_fee, book_fee, duration_months, seats, image_url, id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
      res.json(rows[0]);
    } catch (error: any) {
      console.error('[DB] Update Course Error:', error.message);
      res.status(500).json({ error: 'Failed to update course', details: error.message });
    }
  });

  // Delete Course
  app.delete('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rowCount } = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
      if (rowCount === 0) return res.status(404).json({ error: 'Course not found' });
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // Payments Collection
  app.get('/api/payments', async (req, res) => {
    const { studentId } = req.query;
    try {
      const query = studentId
        ? 'SELECT p.*, s.name as student_name FROM payments p JOIN students s ON p.student_id = s.id WHERE p.student_id = $1 ORDER BY p.created_at DESC'
        : 'SELECT p.*, s.name as student_name FROM payments p JOIN students s ON p.student_id = s.id ORDER BY p.created_at DESC';
      const params = studentId ? [studentId] : [];
      const { rows } = await pool.query(query, params);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  // Get Payment Receipt Data
  app.get('/api/receipt/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(`
        SELECT p.*, s.name as student_name, s.student_id as student_code, s.mobile, s.email, 
               c.name as course_name, c.duration_months
        FROM payments p
        JOIN students s ON p.student_id = s.id
        LEFT JOIN courses c ON s.course_id = c.id
        WHERE p.id = $1
      `, [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch receipt' });
    }
  });

  // Students Collection
  app.get('/api/students', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT s.*, c.name as course_name, c.monthly_fee FROM students s LEFT JOIN courses c ON s.course_id = c.id ORDER BY s.created_at DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  // Create Student
  app.post('/api/students', async (req, res) => {
    const { name, mobile, email, course_id, join_date, status, student_id } = req.body;
    try {
      let finalStudentId = student_id;
      
      // Auto-generate student_id if not provided
      if (!finalStudentId) {
        const year = new Date().getFullYear();
        const countRes = await pool.query('SELECT COUNT(*) FROM students');
        const nextNum = parseInt(countRes.rows[0].count) + 1;
        finalStudentId = `STU-${year}-${String(nextNum).padStart(3, '0')}`;
      }

      const { rows } = await pool.query(
        'INSERT INTO students (student_id, name, mobile, email, course_id, join_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [finalStudentId, name, mobile, email, course_id, join_date, status || 'Active']
      );
      res.json(rows[0]);
    } catch (error: any) {
      console.error('[DB] Create Student Error:', error.message);
      res.status(500).json({ error: 'Failed to create student' });
    }
  });

  // Export Students as CSV (with filters)
  app.get('/api/students/export', async (req, res) => {
    try {
      const { status, course_id } = req.query;
      let query = `
        SELECT s.student_id, s.name, s.mobile, s.email, c.name as course_name, s.join_date, s.status, s.pending_amount 
        FROM students s 
        LEFT JOIN courses c ON s.course_id = c.id
        WHERE 1=1
      `;
      const params = [];
      if (status) {
        params.push(status);
        query += ` AND s.status = $${params.length}`;
      }
      if (course_id) {
        params.push(course_id);
        query += ` AND s.course_id = $${params.length}`;
      }
      query += ' ORDER BY s.created_at DESC';

      const { rows } = await pool.query(query, params);
      
      const csvHeader = 'Student ID,Name,Mobile,Email,Course,Join Date,Status,Pending Amount\n';
      const csvRows = rows.map(r => 
        `"${r.student_id}","${r.name}","${r.mobile}","${r.email}","${r.course_name}","${r.join_date}","${r.status}","${r.pending_amount}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students_export.csv');
      res.status(200).send(csvHeader + csvRows);
    } catch (err: any) {
      console.error('[EXPORT_ERROR]:', err.message);
      res.status(500).send('Export failed');
    }
  });

  // Create Payment
  // Create Payment
  app.post('/api/payments', async (req, res) => {
    const { student_id, amount, mode, status, notes, razorpay_order_id, razorpay_payment_id } = req.body;
    try {
      const studentRes = await pool.query('SELECT name FROM students WHERE id = $1', [student_id]);
      if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
      const student_name = studentRes.rows[0].name;

      const { rows } = await pool.query(
        'INSERT INTO payments (student_id, student_name, amount, mode, status, notes, razorpay_order_id, razorpay_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [student_id, student_name, amount, mode, status, notes, razorpay_order_id, razorpay_payment_id]
      );

      if (status === 'Success') {
        await pool.query('UPDATE students SET pending_amount = CASE WHEN pending_amount - $1 < 0 THEN 0 ELSE pending_amount - $1 END WHERE id = $2', [amount, student_id]);
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('[DB] Payment error:', error);
      res.status(500).json({ error: 'Failed to record payment' });
    }
  });

  // Student ID Search (for Student Portal)
  app.get('/api/student-search/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
      const { rows } = await pool.query('SELECT id FROM students WHERE student_id = $1', [studentId]);
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Get Website Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM website_settings WHERE id = 1');
      res.json(rows[0] || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Update Website Settings
  app.put('/api/settings', async (req, res) => {
    const { institute_name, phone, email, address, facebook_url, twitter_url, instagram_url, linkedin_url, contact_form_email, smtp_host, email_password } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE website_settings SET 
          institute_name = $1, phone = $2, email = $3, address = $4, 
          facebook_url = $5, twitter_url = $6, instagram_url = $7, linkedin_url = $8, contact_form_email = $9,
          smtp_host = $10, email_password = $11
         WHERE id = 1 RETURNING *`,
        [institute_name, phone, email, address, facebook_url, twitter_url, instagram_url, linkedin_url, contact_form_email, smtp_host, email_password]
      );
      // Invalidate SMTP cache to use new credentials immediately
      await getTransporter(true);
      
      res.json(rows[0]);
    } catch (error) {
      console.error('[DB] Setting save error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });
  // Contact Form Endpoint
  app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
      const { rows } = await pool.query('SELECT contact_form_email, smtp_host, email_password FROM website_settings WHERE id = 1');
      const settings = rows[0] || {};

      const transporter = await getTransporter();

      console.log(`\n================================`);
      console.log(`[CONTACT FORM] Message from ${name} (${email})`);
      console.log(`Message: ${message}`);
      console.log(`================================\n`);

      // Check if we have credentials to actually send
      const targetUser = process.env.EMAIL_USER || settings.contact_form_email;
      const targetPass = process.env.EMAIL_PASS || settings.email_password;

      if (targetUser && targetPass) {
        console.log(`[SMTP] Backgrounding contact message to ${targetUser}...`);
        transporter.sendMail({
          from: `"${name}" <${targetUser}>`,
          to: targetUser,
          replyTo: email,
          subject: `New Contact Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }).catch(e => console.error('[SMTP ERR] Background contact mail failed:', e.message));
      }

      res.json({ success: true, message: 'Neural transmission received. Unit will respond.' });
    } catch (error: any) {
      console.error('[DB] Contact Mail Error:', error.message);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Student OTP Auth
  const studentOtps = new Map<string, string>();

  app.post('/api/student-otp', async (req, res) => {
    const { studentId } = req.body;
    try {
      const { rows } = await pool.query('SELECT id, email FROM students WHERE student_id = $1', [studentId]);
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });

      const studentEmail = rows[0].email;
      if (!studentEmail) return res.status(400).json({ error: 'No email registered for this student. Contact admin.' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      studentOtps.set(studentId, otp);

      const settingsRes = await pool.query('SELECT contact_form_email, institute_name, smtp_host, email_password FROM website_settings WHERE id = 1');
      const settings = settingsRes.rows[0] || {};

      const fromName = settings.institute_name || 'NexusCMS Coaching';
      const fromEmail = process.env.EMAIL_USER || settings.contact_form_email;

      console.log(`[SMTP] Attempting delivery to ${studentEmail} via ${fromEmail}...`);

      if (fromEmail) {
        try {
          const transporter = await getTransporter();

          transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: studentEmail,
            subject: 'Your Student Portal Login OTP',
            html: `<div style="font-family: Arial; padding: 20px; text-align: center;"><h2>Student Portal Access</h2><p>Your one-time password is:</p><h1 style="color: #2563eb; letter-spacing: 5px; background: #f3f4f6; padding: 15px; display: inline-block; border-radius: 8px;">${otp}</h1></div>`
          }).catch(e => console.error('[SMTP ERR] Background OTP fail:', e.message));
          
          console.log(`[SMTP] Backgroundizing delivery to ${studentEmail}...`);
        } catch (mailError: any) {
          console.error('[SMTP ERR] Setup fail:', mailError.message);
        }
      }
 else {
        console.warn('SMTP not configured. OTP generated but not emailed.');
      }

      console.log(`\n================================`);
      console.log(`[DEV ONLY] OTP for ${studentId}: ${otp}`);
      console.log(`================================\n`);

      res.json({
        success: true,
        message: 'OTP sent to registered email',
        studentDbId: rows[0].id,
        maskedEmail: maskEmail(studentEmail),
        debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process request.' });
    }
  });

  app.post('/api/verify-student-otp', (req, res) => {
    const { studentId, otp } = req.body;
    const storedOtp = studentOtps.get(studentId);
    if (storedOtp && storedOtp === String(otp)) {
      studentOtps.delete(studentId);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  });
  // Get Enrollment Leads
  app.get('/api/leads', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT l.*, c.name as course_name FROM enrollment_leads l LEFT JOIN courses c ON l.course_id = c.id ORDER BY l.created_at DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  // Create Enrollment Lead
  app.post('/api/enroll', async (req, res) => {
    const { name, email, phone, courseId, message, parent_name, address, previous_school } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO enrollment_leads (name, email, phone, course_id, message, parent_name, address, previous_school) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [name, email || null, phone, courseId || null, message || '', parent_name || null, address || null, previous_school || null]
      );
      
      res.json(rows[0]);

      // Notify Admin in background
      (async () => {
        try {
          const { rows: settingsRows } = await pool.query('SELECT contact_form_email, institute_name FROM website_settings WHERE id = 1');
          const settings = settingsRows[0] || {};
          const transporter = await getTransporter();
          const targetUser = process.env.EMAIL_USER || settings.contact_form_email;
          
          if (targetUser) {
            transporter.sendMail({
              from: `"${settings.institute_name || 'NexusCMS'}" <${targetUser}>`,
              to: targetUser,
              subject: `New Admission Inquiry from ${name}`,
              text: `A new student has applied for admission!\n\nCandidate: ${name}\nPhone: ${phone}\nCourse ID: ${courseId}`,
            }).catch(e => console.error('[SMTP ERR] Background enroll mail fail:', e.message));
          }
        } catch (mailErr: any) {
          console.warn('[MAIL_FAIL] Background notification error:', mailErr.message);
        }
      })();
    } catch (error: any) {
      console.error('[DB] Enroll Error:', error.message);
      res.status(500).json({ error: 'Failed to submit enrollment' });
    }
  });

  // Update Student
  app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, mobile, email, course_id, join_date, status } = req.body;
    try {
      const { rows } = await pool.query(
        'UPDATE students SET name = $1, mobile = $2, email = $3, course_id = $4, join_date = $5, status = $6 WHERE id = $7 RETURNING *',
        [name, mobile, email, course_id, join_date, status, id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update student' });
    }
  });

  // Delete Student
  app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1', [id]);
      if (rowCount === 0) return res.status(404).json({ error: 'Student not found' });
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });

  // Create Order (Updated for PostgreSQL)
  app.post('/api/create-order', async (req, res) => {
    const { amount, studentId } = req.body;
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay keys are missing in environment variables.');
        return res.status(500).json({
          error: 'Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in settings.'
        });
      }
      const options = {
        amount: amount * 100, // to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);

      // We could log the pending payment in PostgreSQL here if needed

      res.json({ ...order, amount: amount });
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      const errorMessage = error.error?.description || 'Failed to create order';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post('/api/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  });

  // OTP Storage (In-memory for demo)
  const otps = new Map<string, { otp: string; generatedAt: number }>();

  app.post('/api/send-otp', async (req, res) => {
    const { email, password } = req.body;
    const requestId = Date.now().toString(36).toUpperCase();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[OTP:${requestId}] Admin OTP request received at ${new Date().toISOString()}`);
    console.log(`[OTP:${requestId}] Login attempt for email: ${email}`);

    // 1. Verify credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'divyanshucmd@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '45876';

    if (email !== adminEmail || password !== adminPassword) {
      console.warn(`[OTP:${requestId}] FAILED — credentials mismatch for: ${email}`);
      console.log(`${'='.repeat(60)}\n`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`[OTP:${requestId}] Credentials verified OK`);

    // 2. Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps.set(email, { otp, generatedAt: Date.now() });
    console.log(`[OTP:${requestId}] OTP generated and stored in memory`);

    // 3. Validate email configuration before attempting send
    try {
      const { rows: settingsRows } = await pool.query('SELECT contact_form_email, email_password FROM website_settings WHERE id = 1');
      const settings = settingsRows[0] || {};

      const smtpUser = process.env.EMAIL_USER || settings.contact_form_email;
      const smtpPass = process.env.EMAIL_PASS || settings.email_password;
      const targetEmail = process.env.ADMIN_OTP_EMAIL || settings.contact_form_email;

      console.log(`[OTP:${requestId}] --- Email Configuration Diagnostics ---`);
      console.log(`[OTP:${requestId}] EMAIL_USER env set:      ${process.env.EMAIL_USER ? 'YES (' + maskEmail(process.env.EMAIL_USER) + ')' : 'NO'}`);
      console.log(`[OTP:${requestId}] EMAIL_PASS env set:      ${process.env.EMAIL_PASS ? 'YES (length=' + process.env.EMAIL_PASS.length + ')' : 'NO'}`);
      console.log(`[OTP:${requestId}] ADMIN_OTP_EMAIL env set: ${process.env.ADMIN_OTP_EMAIL ? 'YES (' + maskEmail(process.env.ADMIN_OTP_EMAIL) + ')' : 'NO'}`);
      console.log(`[OTP:${requestId}] DB contact_form_email:   ${settings.contact_form_email ? maskEmail(settings.contact_form_email) : 'NOT SET'}`);
      console.log(`[OTP:${requestId}] DB email_password set:   ${settings.email_password ? 'YES (length=' + settings.email_password.length + ')' : 'NO'}`);
      console.log(`[OTP:${requestId}] Resolved SMTP sender:   ${smtpUser ? maskEmail(smtpUser) : 'NONE — cannot send'}`);
      console.log(`[OTP:${requestId}] Resolved OTP recipient: ${targetEmail ? maskEmail(targetEmail) : 'NONE — cannot send'}`);
      console.log(`[OTP:${requestId}] --- End Diagnostics ---`);

      // Guard: no SMTP credentials
      if (!smtpUser || !smtpPass) {
        console.error(`[OTP:${requestId}] SMTP credentials missing — EMAIL_USER and/or EMAIL_PASS not configured`);
        console.log(`${'='.repeat(60)}\n`);
        return res.status(500).json({
          error: 'Email service not configured. Set EMAIL_USER and EMAIL_PASS environment variables.',
          debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }

      // Guard: no recipient address
      if (!targetEmail) {
        console.error(`[OTP:${requestId}] No OTP recipient — set ADMIN_OTP_EMAIL environment variable`);
        console.log(`${'='.repeat(60)}\n`);
        return res.status(500).json({
          error: 'OTP recipient not configured. Set ADMIN_OTP_EMAIL environment variable.',
          debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }

      // 4. Build transporter and attempt send
      console.log(`[OTP:${requestId}] Creating SMTP transporter...`);
      const transporter = await getTransporter();
      console.log(`[OTP:${requestId}] Transporter ready`);

      const mailOptions = {
        from: `"NexusCMS Auth" <${smtpUser}>`,
        to: targetEmail,
        subject: 'Admin Neural Access Token',
        html: `
          <div style="font-family: sans-serif; padding: 30px; border: 1px solid #1e293b; border-radius: 20px; max-width: 500px; background: #0f172a; color: white;">
            <h2 style="color: #3b82f6;">NexusCMS Intelligence Access</h2>
            <p style="color: #94a3b8;">Use the following neural token to authorize your session:</p>
            <div style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #fff; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px solid rgba(59,130,246,0.3);">
              ${otp}
            </div>
            <p style="font-size: 11px; color: #475569; text-align: center;">Authorized personnel only. Dynamic token expires in 300 cycles.</p>
          </div>
        `,
      };

      console.log(`[OTP:${requestId}] Attempting to send OTP email...`);
      console.log(`[OTP:${requestId}]   From: ${maskEmail(smtpUser)}`);
      console.log(`[OTP:${requestId}]   To:   ${maskEmail(targetEmail)}`);

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[OTP:${requestId}] Email sent successfully`);
        console.log(`[OTP:${requestId}]   Message ID: ${info.messageId}`);
        console.log(`[OTP:${requestId}]   Response:   ${info.response}`);
        console.log(`[OTP:${requestId}]   Accepted:   ${JSON.stringify(info.accepted)}`);
        console.log(`[OTP:${requestId}]   Rejected:   ${JSON.stringify(info.rejected)}`);
        if (info.rejected && info.rejected.length > 0) {
          console.error(`[OTP:${requestId}] WARNING — some recipients were rejected: ${JSON.stringify(info.rejected)}`);
        }
        console.log(`${'='.repeat(60)}\n`);
        return res.json({ message: 'Neural token dispatched. Check your neural inbox.' });
      } catch (smtpError: any) {
        console.error(`[OTP:${requestId}] SMTP send FAILED`);
        console.error(`[OTP:${requestId}]   Error code:    ${smtpError.code || 'N/A'}`);
        console.error(`[OTP:${requestId}]   Error message: ${smtpError.message}`);
        console.error(`[OTP:${requestId}]   Response code: ${smtpError.responseCode || 'N/A'}`);
        console.error(`[OTP:${requestId}]   Response:      ${smtpError.response || 'N/A'}`);
        console.error(`[OTP:${requestId}]   Command:       ${smtpError.command || 'N/A'}`);
        if (smtpError.code === 'EAUTH') {
          console.error(`[OTP:${requestId}]   DIAGNOSIS: Authentication failed — check EMAIL_USER and EMAIL_PASS. For Gmail, ensure an App Password is used (not your account password).`);
        } else if (smtpError.code === 'ECONNECTION' || smtpError.code === 'ETIMEDOUT') {
          console.error(`[OTP:${requestId}]   DIAGNOSIS: Could not connect to SMTP server — check network/firewall or EMAIL_SERVICE config.`);
        } else if (smtpError.responseCode === 550 || smtpError.responseCode === 553) {
          console.error(`[OTP:${requestId}]   DIAGNOSIS: Recipient address rejected by mail server — verify ADMIN_OTP_EMAIL is a valid address.`);
        }
        console.log(`${'='.repeat(60)}\n`);
        return res.status(500).json({
          error: `Failed to send OTP email: ${smtpError.message}`,
          code: smtpError.code || null,
          debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }

    } catch (error: any) {
      console.error(`[OTP:${requestId}] Unexpected error in send-otp handler: ${error.message}`);
      console.error(error);
      console.log(`${'='.repeat(60)}\n`);
      return res.status(500).json({
        error: 'Internal server error while processing OTP request',
        debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }
  });

  app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otps.get(email);

    console.log(`[VERIFY-OTP] Verification attempt for: ${email}`);

    if (!record) {
      console.warn(`[VERIFY-OTP] No OTP found in memory for: ${email} — OTP was never generated or already used`);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const ageSeconds = Math.floor((Date.now() - record.generatedAt) / 1000);
    const OTP_TTL_SECONDS = 300;

    if (ageSeconds > OTP_TTL_SECONDS) {
      otps.delete(email);
      console.warn(`[VERIFY-OTP] OTP for ${email} expired (age: ${ageSeconds}s, TTL: ${OTP_TTL_SECONDS}s)`);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (record.otp !== String(otp)) {
      console.warn(`[VERIFY-OTP] OTP mismatch for ${email} (age: ${ageSeconds}s)`);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    otps.delete(email);
    console.log(`[VERIFY-OTP] OTP verified successfully for ${email} (age: ${ageSeconds}s)`);
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'client');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }


  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
