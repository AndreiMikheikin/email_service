import React, { useEffect, useState } from 'react';
import { getPoolUsers } from '../api/clientUsers';
import '../styles/components/_clientUserBox.scss';

const ClientUsersBox = ({ onAddClick, onEditClick, reloadFlag }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getPoolUsers();
        console.log('Полученные пользователи:', data);
        setUsers(data.users);
      } catch (err) {
        console.error('Ошибка при получении пользователей:', err.message);
      }
    };

    fetchUsers();
  }, [reloadFlag]);

  const handleSelect = (id) => {
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  const handleEditClick = () => {
    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (selectedUser) onEditClick(selectedUser);
  };

  return (
    <section className="aam_box">
      <h2 className="aam_box__title">Пользователи клиента</h2>

      {Array.isArray(users) && users.length > 0 ? (
        <ul className="aam_box__list">
          {users.map((user) => (
            <li
              key={user.id}
              className={`aam_box__list-item ${selectedUserId === user.id ? 'aam_box__list-item--selected' : ''}`}
              onClick={() => handleSelect(user.id)}
            >
              {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p className="aam_box__list-empty">Нет доступных пользователей.</p>
      )}

      <div className="aam_box__actions">
        <button className="aam_box__button" onClick={onAddClick}>
          Добавить пользователя
        </button>
        <button
          className="aam_box__button"
          onClick={handleEditClick}
          disabled={!selectedUserId}
        >
          Редактировать пользователя
        </button>
      </div>
    </section>
  );
};

export default ClientUsersBox;