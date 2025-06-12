import React, { useState } from 'react';
import { createPoolUser } from '../api/clientUsers';

const AddClientUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await createPoolUser({ email, password });
      setEmail('');
      setPassword('');
      onUserAdded(); // триггерим обновление и закрытие
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="aam_modal-overlay">
      <div className="aam_modal">
        <button className="aam_modal__close" onClick={onClose}>×</button>
        <h3 className="aam_modal__title">Добавить пользователя</h3>

        <form className="aam_box__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email пользователя"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Добавить</button>
        </form>

        {message && <p className="aam_box__message">{message}</p>}
      </div>
    </div>
  );
};

export default AddClientUserModal;