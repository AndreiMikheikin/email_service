import React, { useEffect, useState } from 'react';
import { fetchAdminDashboard } from '../api/auth';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDashboardInfo = async () => {
      try {
        const data = await fetchAdminDashboard();
        setMessage(data.message);
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    getDashboardInfo();
  }, []);

  return (
    <div className="aam_admin-dashboard">
      {error && <p className="aam_error">{error}</p>}
      {message && <p className="aam_success">{message}</p>}
      {user && (
        <div>
          <h2>Добро пожаловать, {user.role}!</h2>
          <p><strong>Email:</strong> {user.role} {user.email}</p>
          {/* можно добавить другое: user.id, user.role, и т.п. */}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;