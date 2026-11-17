-- CampusFix MySQL Schema & Seed Data (phpMyAdmin / MySQL CLI Ready)
CREATE DATABASE IF NOT EXISTS campusfix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusfix_db;

CREATE TABLE IF NOT EXISTS issue_reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  status ENUM('Reported', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Reported',
  reporter_name VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  upvotes INT UNSIGNED NOT NULL DEFAULT 1,
  resolution_notes TEXT NULL,
  resolved_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_severity (status, severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO issue_reports (title, location, category, severity, status, reporter_name, description, upvotes, resolution_notes)
VALUES
  ('Exposed Electrical Outlet Sparking', 'Engineering Bldg, Room 304', 'Safety Hazard', 'Critical', 'Reported', 'Christian Bolea', 'Wall outlet near the front projector sparked when a laptop charger was plugged in.', 14, NULL),
  ('Leaking Pipe Under 2nd Floor Sink', 'Main Building, 2F Restroom', 'Plumbing & Restroom', 'High', 'In Progress', 'Joshua Pornias', 'Water steadily dripping from the P-trap onto the tiled floor.', 9, 'Maintenance team shut off valve; replacement gasket ordered.'),
  ('No Wi-Fi Signal in Study Area', 'University Library, 3F East Wing', 'Network & Wi-Fi', 'High', 'Reported', 'Wayne Nagares', 'Access point AP-LIB-04 shows a blinking red LED and drops connections.', 18, NULL),
  ('Broken Ceiling Fan Blade Wobbling', 'IT Lab 202', 'Electrical & Lighting', 'Medium', 'Reported', 'Darryl Ingente', 'Center ceiling fan vibrates loudly at medium speed.', 5, NULL),
  ('Projector HDMI Port Loose', 'Lecture Hall B', 'Classroom Equipment', 'Medium', 'In Progress', 'Allen Seares', 'Mounted ceiling projector loses display signal unless held at an angle.', 7, 'IT support scheduled cable coupler replacement.'),
  ('Aircon Unit Not Cooling', 'Computer Lab 101', 'Air Conditioning', 'Low', 'Resolved', 'Christian Bolea', 'Split-type AC unit blowing warm air during afternoon lab classes.', 11, 'Cleaned clogged filter and topped up refrigerant.');
