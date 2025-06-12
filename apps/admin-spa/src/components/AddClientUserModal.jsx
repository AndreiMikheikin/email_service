import React from 'react';
import AddClientUserForm from './AddClientUserForm';

const AddClientUserModal = ({ isOpen, onClose, onUserAdded }) => {
  if (!isOpen) return null;

  const handleUserAdded = () => {
    onUserAdded();     // обновить список
    onClose();         // закрыть модалку
  };

  return (
    <div className="aam_modal-overlay" onClick={onClose}>
      <div className="aam_modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="aam_modal__title">Добавить пользователя</h3>
        <AddClientUserForm onUserAdded={handleUserAdded} />
        <button className="aam_modal__close" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default AddClientUserModal;