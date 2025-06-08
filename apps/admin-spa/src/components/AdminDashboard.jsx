// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminDashboard } from '../api/auth';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setMessage(data.message);
        setUser(data.user);
      } catch (err) {
        setMessage('Ошибка доступа: ' + err.message);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>Роль: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;