CREATE DATABASE IF NOT EXISTS complaint_system;
USE complaint_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'staff') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (fullname, email, phone, password, role)
VALUES ('Admin', 'admin@admin.com', '0000000000', 'admin123', 'admin');
