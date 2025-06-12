// apps\admin-spa\src\components\AddClientUserForm.jsx
 
import { useState } from 'react';
import { createPoolUser } from '../api/clientUsers';

const AddClientUserForm = ({ onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await createPoolUser({ email, password });
      setMessage('Пользователь успешно добавлен');
      setEmail('');
      setPassword('');
      onUserAdded(); // чтобы обновить список
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  return (
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
      {message && <p className="aam_box__message">{message}</p>}
    </form>
  );
};

export default AddClientUserForm;