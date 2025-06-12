import { useState } from 'react';
import { updatePoolUserPassword, deletePoolUser } from '../api/clientUsers';

const EditClientUserModal = ({ user, onClose, onUserUpdated }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await updatePoolUserPassword(user.id, password);
      setMessage('Пароль обновлён');
      setPassword('');
      onUserUpdated(); // обновить список
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Удалить пользователя ${user.email}?`)) return;
    setLoading(true);
    try {
      await deletePoolUser(user.id);
      onUserUpdated(); // обновить список
      onClose(); // закрыть модалку
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aam_modal">
      <div className="aam_modal__content">
        <h3>Редактировать пользователя</h3>
        <p>Email: <strong>{user.email}</strong></p>

        <input
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="aam_modal__actions">
          <button onClick={handleUpdate} disabled={loading || !password}>
            Обновить пароль
          </button>
          <button onClick={handleDelete} disabled={loading} className="danger">
            Удалить пользователя
          </button>
        </div>

        {message && <p className="aam_modal__message">{message}</p>}
        <button onClick={onClose} className="aam_modal__close">×</button>
      </div>
    </div>
  );
};

export default EditClientUserModal;
