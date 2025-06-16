# Email Service Platform

Публичный сервис для отправки HTML-писем через SMTP с административной панелью и интерфейсом клиента.

## 📦 Общая структура

root/
├── email_service/ # Backend (Node.js + Express)
├── apps/
│ ├── admin-spa/ # Админ-панель (Vite + React)
│ └── client-spa/ # Интерфейс клиента (Vite + React)

## 🌐 Порты и адреса

| Назначение       | Адрес/Порт                   |
|------------------|------------------------------|
| Админ SPA        | http://178.250.247.67:3344   |
| Клиент SPA       | http://178.250.247.67:3345   |
| Backend API      | http://178.250.247.67:3355   |

## 🧠 Архитектура

### 🧰 Backend (`email_service`)
- **Стек:** Node.js, Express
- **Структура:**

src/
├── config/ # Настройки (включая БД)
├── controllers/ # Логика API
├── models/ # Работа с БД (например, users, pool_of_users)
├── routes/ # API-маршруты
├── services/ # SMTP, JWT и пр.
├── utils/ # Утилиты
├── middlewares/ # Проверки, auth
└── jobs/ # (по необходимости) фоновые задачи

- **Функции:**
  - Аутентификация (JWT, bcrypt)
  - Подтверждение email
  - Восстановление пароля
  - Zero-time deploy (PM2 + GitHub Actions)
  - Отправка писем через SMTP
  - CRUD для:
    - client-пользователей
    - email-контактов
    - шаблонов писем
  - Генерация `sitemap.xml` и переиндексация

- **БД:**
  - `users` — админы (доступ к `admin-spa`)
  - `pool_of_users` — клиентские пользователи (привязка через `admin_id`)

---

### 🧑‍💼 `admin-spa`
- **Фреймворк:** Vite + React
- **Стили:** SCSS с префиксом `aam_`, тёмно-зелёная палитра
- **Фичи:**
  - Регистрация/авторизация
  - Сброс/восстановление пароля
  - CRUD client-пользователей
  - Управление адресной книгой и шаблонами
  - Отправка email-уведомлений новым client-пользователям
  - Изоляция данных по `admin_id`

---

### 👤 `client-spa`
- **Фреймворк:** Vite + React
- **Стили:** SCSS, единый стиль
- **Фичи:**
  - Аутентификация client-пользователей (`pool_of_users`)
  - Доступ только по логину и паролю, выданным админом
  - Просмотр:
    - Email-отправителя (его email)
    - Адресной книги
    - HTML-шаблонов
  - Интерфейс отправки писем
  - Вся работа строго в рамках `admin_id`

---

## ⚙️ .env

Пример `.env` для `email_service`:

PORT=3355
JWT_SECRET=your_jwt_secret
SMTP_USER=you@example.com
SMTP_PASS=your_password

Пример `.env` для Vite (оба SPA):

VITE_API_URL=http://178.250.247.67:3355

---

## ✅ Тесты

- Используется: `jest`, `supertest`
- Покрытие:
  - Аутентификация (`auth.test.js`)
  - CRUD client-пользователей
  - Проверка восстановления пароля
  - Авторизация и валидация JWT

---

## 🛰 Деплой

- Настроен zero-downtime деплой через:
  - **GitHub Actions** (`.github/workflows/deploy.yml`)
  - **PM2** (`ecosystem.config.js`)
- SPA собираются через Vite и деплоятся на сервер.

---

## 📌 Прочее

- Реализован CORS с поддержкой credentials (`Access-Control-Allow-Credentials`)
- Используется `axios` с `withCredentials: true` в SPA
- Прокси Vite (`/api`) настроен на порт `3355`
- Префильтры (`OPTIONS`) обрабатываются Express автоматически

---