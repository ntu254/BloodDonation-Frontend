-- Tạo database
CREATE DATABASE BloodDonationDBv2;
GO

USE BloodDonationDBv2;
GO

-- Tạo bảng blood_types
CREATE TABLE blood_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    blood_group VARCHAR(3) NOT NULL,
    component_type VARCHAR(20) NOT NULL DEFAULT 'Whole Blood',
    description VARCHAR(50),
    shelf_life_days INT NOT NULL DEFAULT 35,
    storage_temp_min DECIMAL(4,2),
    storage_temp_max DECIMAL(4,2),
    volume_ml INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT UQ_blood_group_component UNIQUE (blood_group, component_type),
    CONSTRAINT CK_blood_types_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT CK_blood_types_component_type CHECK (component_type IN ('Whole Blood', 'Red Blood Cells', 'Plasma', 'Platelets', 'White Blood Cells', 'Cryoprecipitate', 'Fresh Frozen Plasma'))
);

CREATE INDEX IX_blood_types_group ON blood_types(blood_group);
CREATE INDEX IX_blood_types_component ON blood_types(component_type);

-- Tạo bảng roles
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions NVARCHAR(MAX),
    description VARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Tạo bảng users
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address NVARCHAR(MAX),
    latitude FLOAT,
    longitude FLOAT,
    emergency_contact VARCHAR(255),
    blood_type_id INT,
    medical_conditions NVARCHAR(MAX),
    last_donation_date DATE,
    is_ready_to_donate BIT DEFAULT 1,
    role_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    email_verified BIT DEFAULT 0,
    phone_verified BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT FK_users_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT CK_users_status CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Banned')),
    CONSTRAINT CK_users_gender CHECK (gender IN ('Male', 'Female', 'Other'))
);

CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_phone ON users(phone);
CREATE INDEX IX_users_blood_type_id ON users(blood_type_id);
CREATE INDEX IX_users_status ON users(status);
CREATE INDEX IX_users_location ON users(latitude, longitude);
-- Tạo bảng hospitals
CREATE TABLE hospitals (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address NVARCHAR(MAX),
    phone VARCHAR(20),
    email VARCHAR(150),
    latitude FLOAT,
    longitude FLOAT,
    license_number VARCHAR(100),
    contact_person VARCHAR(150),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX IX_hospitals_license ON hospitals(license_number);

-- Tạo bảng blood_type_compatibility
CREATE TABLE blood_type_compatibility (
    id INT IDENTITY(1,1) PRIMARY KEY,
    donor_blood_type_id INT NOT NULL,
    recipient_blood_type_id INT NOT NULL,
    is_compatible BIT NOT NULL,
    compatibility_score INT DEFAULT 100,
    is_emergency_compatible BIT DEFAULT 0,
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_compatibility_donor_blood_type FOREIGN KEY (donor_blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT FK_compatibility_recipient_blood_type FOREIGN KEY (recipient_blood_type_id) REFERENCES blood_types(id)
);

CREATE INDEX IX_compatibility_types ON blood_type_compatibility(donor_blood_type_id, recipient_blood_type_id);

-- Tạo bảng blood_requests
CREATE TABLE blood_requests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    requester_type VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_contact VARCHAR(255),
    blood_type_id INT NOT NULL,
    volume_ml INT NOT NULL,
    urgency_level VARCHAR(20) DEFAULT 'Normal',
    medical_reason NVARCHAR(MAX),
    hospital_id INT,
    doctor_name VARCHAR(150),
    required_by_date DATETIME2,
    location VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    status VARCHAR(20) DEFAULT 'Pending',
    verified_by BIGINT,
    verified_at DATETIME2,
    verification_notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_blood_requests_requester_id FOREIGN KEY (requester_id) REFERENCES users(id),
    CONSTRAINT FK_blood_requests_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT FK_blood_requests_hospital_id FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    CONSTRAINT FK_blood_requests_verified_by FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT CK_blood_requests_requester_type CHECK (requester_type IN ('Individual', 'Hospital', 'Organization')),
    CONSTRAINT CK_blood_requests_urgency_level CHECK (urgency_level IN ('Low', 'Normal', 'High', 'Critical', 'Emergency')),
    CONSTRAINT CK_blood_requests_status CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Fulfilled', 'Cancelled', 'Expired'))
);

CREATE INDEX IX_requests_status ON blood_requests(status);
CREATE INDEX IX_requests_urgency ON blood_requests(urgency_level);
CREATE INDEX IX_requests_blood_type_id ON blood_requests(blood_type_id);
CREATE INDEX IX_requests_required_date ON blood_requests(required_by_date);
CREATE INDEX IX_requests_location ON blood_requests(latitude, longitude);
CREATE INDEX IX_requests_hospital ON blood_requests(hospital_id);

-- Tạo bảng donation_appointments
CREATE TABLE donation_appointments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    blood_request_id INT,
    blood_type_id INT NOT NULL,
    appointment_date DATETIME2 NOT NULL,
    appointment_time_slot VARCHAR(20),
    location VARCHAR(255),
    hospital_id INT,
    latitude FLOAT,
    longitude FLOAT,
    status VARCHAR(20) DEFAULT 'Scheduled',
    appointment_type VARCHAR(20) DEFAULT 'Regular',
    notes NVARCHAR(MAX),
    reminder_sent BIT DEFAULT 0,
    reminder_sent_at DATETIME2,
    confirmed_by BIGINT,
    confirmed_at DATETIME2,
    cancelled_reason NVARCHAR(MAX),
    cancelled_by BIGINT,
    cancelled_at DATETIME2,
    rescheduled_from INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_appointments_donor_id FOREIGN KEY (donor_id) REFERENCES users(id),
    CONSTRAINT FK_appointments_blood_request_id FOREIGN KEY (blood_request_id) REFERENCES blood_requests(id),
    CONSTRAINT FK_appointments_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT FK_appointments_hospital_id FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    CONSTRAINT FK_appointments_confirmed_by FOREIGN KEY (confirmed_by) REFERENCES users(id),
    CONSTRAINT FK_appointments_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES users(id),
    CONSTRAINT FK_appointments_rescheduled_from FOREIGN KEY (rescheduled_from) REFERENCES donation_appointments(id),
    CONSTRAINT CK_appointments_status CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show', 'Rescheduled')),
    CONSTRAINT CK_appointments_type CHECK (appointment_type IN ('Regular', 'Emergency', 'Walk-in', 'Mobile Drive'))
);

CREATE INDEX IX_appointments_donor ON donation_appointments(donor_id);
CREATE INDEX IX_appointments_date ON donation_appointments(appointment_date);
CREATE INDEX IX_appointments_status ON donation_appointments(status);
CREATE INDEX IX_appointments_hospital ON donation_appointments(hospital_id);
CREATE INDEX IX_appointments_request ON donation_appointments(blood_request_id);
CREATE INDEX IX_appointments_blood_type ON donation_appointments(blood_type_id);

-- Tạo bảng health_checks
CREATE TABLE health_checks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    appointment_id INT,
    check_date DATETIME2 NOT NULL,
    blood_pressure VARCHAR(50),
    weight FLOAT,
    temperature FLOAT,
    hemoglobin_level FLOAT,
    questionnaire NVARCHAR(MAX),
    result VARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX),
    checked_by BIGINT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_health_checks_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_health_checks_appointment_id FOREIGN KEY (appointment_id) REFERENCES donation_appointments(id),
    CONSTRAINT FK_health_checks_checked_by FOREIGN KEY (checked_by) REFERENCES users(id),
    CONSTRAINT CK_health_checks_result CHECK (result IN ('Pass', 'Fail', 'Deferred', 'Pending'))
);

CREATE INDEX IX_health_checks_user ON health_checks(user_id);
CREATE INDEX IX_health_checks_appointment ON health_checks(appointment_id);
CREATE INDEX IX_health_checks_date ON health_checks(check_date);
CREATE INDEX IX_health_checks_result ON health_checks(result);

-- Tạo bảng blood_donation_processes
CREATE TABLE blood_donation_processes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    appointment_id INT NOT NULL,
    blood_request_id INT,
    blood_type_id INT NOT NULL,
    health_check_id INT,
    donation_date DATETIME2,
    location VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    volume_ml INT,
    bag_serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'Scheduled',
    failure_reason NVARCHAR(MAX),
    staff_id BIGINT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_donations_donor_id FOREIGN KEY (donor_id) REFERENCES users(id),
    CONSTRAINT FK_donations_appointment_id FOREIGN KEY (appointment_id) REFERENCES donation_appointments(id),
    CONSTRAINT FK_donations_blood_request_id FOREIGN KEY (blood_request_id) REFERENCES blood_requests(id),
    CONSTRAINT FK_donations_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT FK_donations_health_check_id FOREIGN KEY (health_check_id) REFERENCES health_checks(id),
    CONSTRAINT FK_donations_staff_id FOREIGN KEY (staff_id) REFERENCES users(id),
    CONSTRAINT CK_donations_status CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Failed', 'Cancelled'))
);

CREATE INDEX IX_donations_donor ON blood_donation_processes(donor_id);
CREATE INDEX IX_donations_appointment ON blood_donation_processes(appointment_id);
CREATE INDEX IX_donations_status ON blood_donation_processes(status);
CREATE INDEX IX_donations_date ON blood_donation_processes(donation_date);
CREATE INDEX IX_donations_request ON blood_donation_processes(blood_request_id);
CREATE INDEX IX_donations_blood_type ON blood_donation_processes(blood_type_id);

-- Tạo bảng blood_test_results
CREATE TABLE blood_test_results (
    id INT IDENTITY(1,1) PRIMARY KEY,
    donation_process_id INT NOT NULL,
    test_date DATETIME2 NOT NULL,
    test_panel VARCHAR(100) NOT NULL,
    test_results NVARCHAR(MAX) NOT NULL,
    result_status VARCHAR(20) NOT NULL,
    tested_by BIGINT,
    reviewed_by BIGINT,
    reviewed_at DATETIME2,
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_test_results_donation_process_id FOREIGN KEY (donation_process_id) REFERENCES blood_donation_processes(id),
    CONSTRAINT FK_test_results_tested_by FOREIGN KEY (tested_by) REFERENCES users(id),
    CONSTRAINT FK_test_results_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id),
    CONSTRAINT CK_test_results_status CHECK (result_status IN ('Pending', 'Pass', 'Fail', 'Inconclusive', 'Retest Required'))
);

CREATE INDEX IX_test_results_donation ON blood_test_results(donation_process_id);
CREATE INDEX IX_test_results_date ON blood_test_results(test_date);
CREATE INDEX IX_test_results_status ON blood_test_results(result_status);

-- Tạo bảng blood_inventory
CREATE TABLE blood_inventory (
    id INT IDENTITY(1,1) PRIMARY KEY,
    donation_process_id INT NOT NULL,
    blood_type_id INT NOT NULL,
    current_volume_ml INT NOT NULL,
    original_volume_ml INT NOT NULL,
    batch_number VARCHAR(50),
    bag_serial_number VARCHAR(100) UNIQUE,
    collection_date DATETIME2 NOT NULL,
    expiration_date DATE NOT NULL,
    storage_location VARCHAR(100),
    hospital_id INT,
    status VARCHAR(20) DEFAULT 'Available',
    reserved_for_request_id INT,
    used_at DATETIME2,
    used_by BIGINT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_inventory_donation_process_id FOREIGN KEY (donation_process_id) REFERENCES blood_donation_processes(id),
    CONSTRAINT FK_inventory_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT FK_inventory_hospital_id FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    CONSTRAINT FK_inventory_reserved_for_request_id FOREIGN KEY (reserved_for_request_id) REFERENCES blood_requests(id),
    CONSTRAINT FK_inventory_used_by FOREIGN KEY (used_by) REFERENCES users(id),
    CONSTRAINT CK_inventory_status CHECK (status IN ('Available', 'Reserved', 'Used', 'Expired', 'Quarantined', 'Discarded'))
);

CREATE INDEX IX_inventory_status ON blood_inventory(status);
CREATE INDEX IX_inventory_blood_type_id ON blood_inventory(blood_type_id);
CREATE INDEX IX_inventory_expiration ON blood_inventory(expiration_date);
CREATE INDEX IX_inventory_location ON blood_inventory(storage_location);
CREATE INDEX IX_inventory_hospital ON blood_inventory(hospital_id);

-- Tạo bảng inventory_transactions
CREATE TABLE inventory_transactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    inventory_id INT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    quantity_ml INT NOT NULL,
    reference_type VARCHAR(30),
    reference_id INT,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    performed_by BIGINT NOT NULL,
    transaction_date DATETIME2 DEFAULT GETDATE(),
    notes NVARCHAR(MAX),
    
    CONSTRAINT FK_transactions_inventory_id FOREIGN KEY (inventory_id) REFERENCES blood_inventory(id),
    CONSTRAINT FK_transactions_performed_by FOREIGN KEY (performed_by) REFERENCES users(id),
    CONSTRAINT CK_transactions_type CHECK (transaction_type IN ('Add', 'Remove', 'Transfer', 'Reserve', 'Release', 'Expire', 'Discard'))
);

CREATE INDEX IX_transactions_inventory ON inventory_transactions(inventory_id);
CREATE INDEX IX_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IX_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX IX_transactions_performed_by ON inventory_transactions(performed_by);

-- Tạo bảng reminders
CREATE TABLE reminders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    appointment_id INT,
    reminder_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    reminder_date DATETIME2 NOT NULL,
    is_sent BIT DEFAULT 0,
    sent_at DATETIME2,
    status VARCHAR(20) DEFAULT 'Pending',
    related_entity_type VARCHAR(30),
    related_entity_id INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_reminders_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_reminders_appointment_id FOREIGN KEY (appointment_id) REFERENCES donation_appointments(id),
    CONSTRAINT CK_reminders_type CHECK (reminder_type IN ('Appointment', 'Donation Eligibility', 'Health Check', 'Follow Up', 'General')),
    CONSTRAINT CK_reminders_status CHECK (status IN ('Pending', 'Sent', 'Failed', 'Cancelled'))
);

CREATE INDEX IX_reminders_user ON reminders(user_id);
CREATE INDEX IX_reminders_appointment ON reminders(appointment_id);
CREATE INDEX IX_reminders_date ON reminders(reminder_date);
CREATE INDEX IX_reminders_status ON reminders(status);
CREATE INDEX IX_reminders_type ON reminders(reminder_type);

-- Tạo bảng notifications
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    type VARCHAR(30) NOT NULL,
    priority INT DEFAULT 1,
    related_entity_type VARCHAR(30),
    related_entity_id INT,
    is_read BIT DEFAULT 0,
    read_at DATETIME2,
    expires_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT CK_notifications_type CHECK (type IN ('Info', 'Warning', 'Error', 'Success', 'Reminder', 'Alert')),
    CONSTRAINT CK_notifications_priority CHECK (priority BETWEEN 1 AND 5)
);

CREATE INDEX IX_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IX_notifications_priority ON notifications(priority);
CREATE INDEX IX_notifications_type ON notifications(type);
CREATE INDEX IX_notifications_expires ON notifications(expires_at);

-- Tạo bảng blog
CREATE TABLE blog (
    id INT IDENTITY(1,1) PRIMARY KEY,
    blog_type VARCHAR(20) NOT NULL,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    summary VARCHAR(500),
    blog_html NVARCHAR(MAX),
    featured_image VARCHAR(255),
    tags VARCHAR(255),
    author_id BIGINT,
    status VARCHAR(20) DEFAULT 'draft',
    published_at DATETIME2,
    view_count INT DEFAULT 0,
    meta_description VARCHAR(160),
    meta_keywords VARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_blog_author_id FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT CK_blog_type CHECK (blog_type IN ('Article', 'News', 'FAQ', 'Guide', 'Policy', 'Announcement')),
    CONSTRAINT CK_blog_status CHECK (status IN ('draft', 'published', 'archived', 'deleted'))
);

CREATE INDEX IX_blog_type_status ON blog(blog_type, status);
CREATE INDEX IX_blog_category ON blog(category);
CREATE INDEX IX_blog_published ON blog(published_at);
CREATE INDEX IX_blog_slug ON blog(slug);

-- Tạo bảng location_searches
CREATE TABLE location_searches (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,
    search_type VARCHAR(20),
    search_latitude FLOAT NOT NULL,
    search_longitude FLOAT NOT NULL,
    search_radius_km INT DEFAULT 50,
    blood_type_id INT,
    urgency_level VARCHAR(20),
    results_found INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_location_searches_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_location_searches_blood_type_id FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    CONSTRAINT CK_location_searches_type CHECK (search_type IN ('Donor', 'Hospital', 'Inventory', 'Request'))
);

CREATE INDEX IX_location_searches_coordinates ON location_searches(search_latitude, search_longitude);
CREATE INDEX IX_location_searches_user ON location_searches(user_id);
CREATE INDEX IX_location_searches_type ON location_searches(search_type);
CREATE INDEX IX_location_searches_blood_type_id ON location_searches(blood_type_id);
CREATE INDEX IX_location_searches_created ON location_searches(created_at);

-- Thêm dữ liệu mẫu cho blood_types
INSERT INTO blood_types (blood_group, component_type, description, shelf_life_days, storage_temp_min, storage_temp_max, volume_ml) VALUES
('A+', 'Whole Blood', 'A positive whole blood', 35, 1.0, 6.0, 450),
('A+', 'Red Blood Cells', 'A positive red blood cells', 42, 1.0, 6.0, 250),
('A+', 'Plasma', 'A positive plasma', 365, -18.0, -30.0, 200),
('A+', 'Platelets', 'A positive platelets', 5, 20.0, 24.0, 50),
('A-', 'Whole Blood', 'A negative whole blood', 35, 1.0, 6.0, 450),
('A-', 'Red Blood Cells', 'A negative red blood cells', 42, 1.0, 6.0, 250),
('A-', 'Plasma', 'A negative plasma', 365, -18.0, -30.0, 200),
('A-', 'Platelets', 'A negative platelets', 5, 20.0, 24.0, 50),
('B+', 'Whole Blood', 'B positive whole blood', 35, 1.0, 6.0, 450),
('B+', 'Red Blood Cells', 'B positive red blood cells', 42, 1.0, 6.0, 250),
('B+', 'Plasma', 'B positive plasma', 365, -18.0, -30.0, 200),
('B+', 'Platelets', 'B positive platelets', 5, 20.0, 24.0, 50),
('B-', 'Whole Blood', 'B negative whole blood', 35, 1.0, 6.0, 450),
('B-', 'Red Blood Cells', 'B negative red blood cells', 42, 1.0, 6.0, 250),
('B-', 'Plasma', 'B negative plasma', 365, -18.0, -30.0, 200),
('B-', 'Platelets', 'B negative platelets', 5, 20.0, 24.0, 50),
('AB+', 'Whole Blood', 'AB positive whole blood', 35, 1.0, 6.0, 450),
('AB+', 'Red Blood Cells', 'AB positive red blood cells', 42, 1.0, 6.0, 250),
('AB+', 'Plasma', 'AB positive plasma', 365, -18.0, -30.0, 200),
('AB+', 'Platelets', 'AB positive platelets', 5, 20.0, 24.0, 50),
('AB-', 'Whole Blood', 'AB negative whole blood', 35, 1.0, 6.0, 450),
('AB-', 'Red Blood Cells', 'AB negative red blood cells', 42, 1.0, 6.0, 250),
('AB-', 'Plasma', 'AB negative plasma', 365, -18.0, -30.0, 200),
('AB-', 'Platelets', 'AB negative platelets', 5, 20.0, 24.0, 50),
('O+', 'Whole Blood', 'O positive whole blood', 35, 1.0, 6.0, 450),
('O+', 'Red Blood Cells', 'O positive red blood cells', 42, 1.0, 6.0, 250),
('O+', 'Plasma', 'O positive plasma', 365, -18.0, -30.0, 200),
('O+', 'Platelets', 'O positive platelets', 5, 20.0, 24.0, 50),
('O-', 'Whole Blood', 'O negative whole blood', 35, 1.0, 6.0, 450),
('O-', 'Red Blood Cells', 'O negative red blood cells', 42, 1.0, 6.0, 250),
('O-', 'Plasma', 'O negative plasma', 365, -18.0, -30.0, 200),
('O-', 'Platelets', 'O negative platelets', 5, 20.0, 24.0, 50);

-- Thêm dữ liệu mẫu cho roles
INSERT INTO roles (name, description) VALUES
('Admin', 'System administrator with full access'),
('Staff', 'Hospital/clinic staff member'),
('Member', 'Blood donor or patient'),

GO
