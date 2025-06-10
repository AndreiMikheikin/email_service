-- 1. Таблица для client-spa пользователей
CREATE TABLE IF NOT EXISTS pool_of_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Обновление таблицы recipients (admin_id)
ALTER TABLE recipients
  ADD COLUMN IF NOT EXISTS admin_id INT NOT NULL;

ALTER TABLE recipients
  ADD CONSTRAINT IF NOT EXISTS fk_recipients_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Обновление таблицы templates (admin_id)
ALTER TABLE templates
  ADD COLUMN IF NOT EXISTS admin_id INT NOT NULL;

ALTER TABLE templates
  ADD CONSTRAINT IF NOT EXISTS fk_templates_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;

-- 4. Обновление таблицы send_history:
-- добавил ссылку на pool_of_users и admin
ALTER TABLE send_history
  ADD COLUMN IF NOT EXISTS pool_user_id INT;

ALTER TABLE send_history
  ADD COLUMN IF NOT EXISTS admin_id INT;

ALTER TABLE send_history
  ADD CONSTRAINT IF NOT EXISTS fk_send_history_user FOREIGN KEY (pool_user_id) REFERENCES pool_of_users(id) ON DELETE SET NULL;

ALTER TABLE send_history
  ADD CONSTRAINT IF NOT EXISTS fk_send_history_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL;