import React, { useEffect, useState } from 'react';
import { fetchAdminDashboard } from '../api/auth';
import '../styles/components/_adminDashboard.scss';

// Создание и редактирование пользователей
import ClientUsersBox from './ClientUsersBox';
import AddClientUserModal from './AddClientUserModal';
import EditClientUserModal from './EditClientUserModal';

// Создание и редактирование шаблонов
import EmailTemplatesBox from './EmailTemplatesBox';
import AddTemplateModal from './AddTemplateModal';
import EditTemplateModal from './EditTemplateModal';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Пользователи
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Шаблоны
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [reloadFlag, setReloadFlag] = useState(false); // для обновления списка
  const triggerReload = () => setReloadFlag(prev => !prev);

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

  // Пользователи — обработчики
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  // Шаблоны — обработчики
  const handleOpenAddTemplateModal = () => setIsAddTemplateModalOpen(true);
  const handleCloseAddTemplateModal = () => setIsAddTemplateModalOpen(false);

  const handleOpenEditTemplateModal = (template) => {
    setSelectedTemplate(template);
    setIsEditTemplateModalOpen(true);
  };
  const handleCloseEditTemplateModal = () => {
    setSelectedTemplate(null);
    setIsEditTemplateModalOpen(false);
  };

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
          <ClientUsersBox
            onAddClick={handleOpenAddModal}
            onEditClick={handleOpenEditModal}
            reloadFlag={reloadFlag}
          />
          <EmailTemplatesBox />
        </div>
      </main>

      {/* Пользователи */}
      {isAddModalOpen && (
        <AddClientUserModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onUserAdded={() => {
            triggerReload();
            handleCloseAddModal();
          }}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditClientUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUserUpdated={() => {
            triggerReload();
            handleCloseEditModal();
          }}
          onUserDeleted={() => {
            triggerReload();
            handleCloseEditModal();
          }}
        />
      )}
      
      {/* Шаблоны */}
      {isAddTemplateModalOpen && (
        <AddTemplateModal
          isOpen={isAddTemplateModalOpen}
          onClose={handleCloseAddTemplateModal}
          onTemplateAdded={() => {
            triggerReload();
            handleCloseAddTemplateModal();
          }}
        />
      )}

      {isEditTemplateModalOpen && selectedTemplate && (
        <EditTemplateModal
          isOpen={isEditTemplateModalOpen}
          onClose={handleCloseEditTemplateModal}
          template={selectedTemplate}
          onTemplateUpdated={() => {
            triggerReload();
            handleCloseEditTemplateModal();
          }}
          onTemplateDeleted={() => {
            triggerReload();
            handleCloseEditTemplateModal();
          }}
        />
      )}

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