import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClientUsers } from '../api/clientUsers';

const ClientUsersBox = () => {
  const [clientUsers, setClientUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getClientUsers();
        setClientUsers(users);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
  };

  const handleButtonClick = () => {
    if (selectedUserId) {
      navigate(`/adminDashboard/clientUsers/edit/${selectedUserId}`);
    } else {
      navigate('/adminDashboard/clientUsers/create');
    }
  };

  return (
    <section className="aam_clientUsersBox">
      <h2 className="aam_clientUsersBox_title">Пользователи</h2>

      {error && <p className="aam_clientUsersBox_error">{error}</p>}

      <ul className="aam_clientUsersBox_list">
        {clientUsers.map(user => (
          <li
            key={user.id}
            className={`aam_clientUsersBox_item ${selectedUserId === user.id ? 'aam_selected' : ''}`}
            onClick={() => handleUserClick(user.id)}
          >
            {user.email}
          </li>
        ))}
      </ul>

      <button
        className="aam_clientUsersBox_button"
        onClick={handleButtonClick}
      >
        {selectedUserId ? 'Редактировать пользователя' : 'Добавить пользователя'}
      </button>
    </section>
  );
};

export default ClientUsersBox;