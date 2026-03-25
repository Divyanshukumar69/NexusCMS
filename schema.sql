-- PostgreSQL Schema for NexusCMS

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    book_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    duration_months INTEGER NOT NULL DEFAULT 0,
    seats INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Overdue')),
    pending_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255), -- Denormalized for quick performance
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mode VARCHAR(50) NOT NULL DEFAULT 'Manual' CHECK (mode IN ('UPI', 'Card', 'Netbanking', 'Cash', 'Manual')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Success', 'Pending', 'Failed')),
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    institute_name VARCHAR(255) DEFAULT 'NexusCMS Coaching Institute'
);

-- Enrollment Leads
CREATE TABLE IF NOT EXISTS enrollment_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Enrolled', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Website Settings
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
);

-- Initialize default settings if not exists
INSERT INTO website_settings (id, institute_name) 
VALUES (1, 'NexusCMS Coaching') 
ON CONFLICT (id) DO NOTHING;
