import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('client_token');
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Авто-логин при наличии токена
  useEffect(() => {
    const token = localStorage.getItem('client_token');
    if (!token) setUser(null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem('client_token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onLogin={(userData) => {
                  setUser(userData);
                  localStorage.setItem('user', JSON.stringify(userData));
                }}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;