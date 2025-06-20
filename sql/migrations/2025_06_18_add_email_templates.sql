CREATE TABLE email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html TEXT NOT NULL,
  variables JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);