// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/users/adminDashboard', {
          withCredentials: true, // если нужны куки
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setMessage(res.data.message);
        setUser(res.data.user);
      } catch (err) {
        setMessage('Ошибка доступа: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchDashboard();
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