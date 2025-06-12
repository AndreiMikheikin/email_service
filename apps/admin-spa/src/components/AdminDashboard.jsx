import React, { useEffect, useState } from 'react';
import { fetchAdminDashboard } from '../api/auth';
import ClientUsersBox from './ClientUsersBox';
import AddClientUserModal from './AddClientUserModal';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false); // для обновления списка

  const triggerReload = () => setReloadFlag(prev => !prev); // смена флага

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
    <>
      <header className="aam_dashboard_header">
        <div className="aam_dashboard_header-content">
          <h1 className="aam_dashboard_title">{message}</h1>

          {user && (
            <div className="aam_dashboard_user-info">
              <p>Email: {user.email}</p>
              <p>Роль: {user.role}</p>
            </div>
          )}
        </div>
      </header>

      <main className="aam_dashboard_main">
        <div className="aam_dashboard_preview-grid">
          <ClientUsersBox onAddClick={() => setIsModalOpen(true)} reloadFlag={reloadFlag} />
        </div>
      </main>

      <AddClientUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={() => {
          triggerReload();
          setIsModalOpen(false);
        }}
      />

      <footer className="aam_dashboard_footer">
        <a href="#" className="aam_dashboard_footer-link">Телеграм канал</a>
        <span className="aam_dashboard_footer-copy">Все права защищены</span>
        <div className="aam_dashboard_footer-contacts">
          <a href="mailto:" className="aam_dashboard_footer-contact">мой адрес</a>
          <a href="tel:" className="aam_dashboard_footer-contact">мой телефон</a>
        </div>
      </footer>
    </>
  );
};

export default AdminDashboard;