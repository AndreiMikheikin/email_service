module.exports = {
  apps: [
    {
      name: "email-service",
      script: "./src/index.js",
      cwd: "/root/email-service",
      env: {
        NODE_ENV: "production",
        PORT: "3355",

        DB_HOST: "localhost",
        DB_USER: "mailer_user",
        DB_PASSWORD: "StrongMailerPass!2025",
        DB_NAME: "email_service",

        SMTP_USER: "mikhejyshka@gmail.com",
        SMTP_PASS: "sbzl cmze zbte vkug",
        JWT_SECRET: "wj4GhYwF98wz+jRY0rLDGyh2vCPyX2Z9REn+/HGU9lw="
      }
    },
    {
      name: "admin-spa",
      script: "./server.js",
      cwd: "/root/email-service/apps/admin-spa",
      env: {
        NODE_ENV: "production",
        PORT: "3344",
	VITE_API_URL: "http://localhost:3355"
      }
    }
  ]
};