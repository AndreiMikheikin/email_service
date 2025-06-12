import React, { useEffect, useState } from 'react';
import { getPoolUsers } from '../api/clientUsers';
import { useNavigate } from 'react-router-dom';

const ClientUsersBox = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPoolUsers();
                setUsers(data);
            } catch (err) {
                console.error('Ошибка при получении пользователей:', err.message);
            }
        };

        fetchUsers();
    }, []);

    const handleSelect = (id) => {
        setSelectedUserId(id === selectedUserId ? null : id);
    };

    const goToCreate = () => navigate('/adminDashboard/clientUsers/create');
    const goToEdit = () => {
        if (selectedUserId) navigate(`/adminDashboard/clientUsers/${selectedUserId}`);
    };

    return (
        <section className="aam_box">
            <h2 className="aam_box__title">Пользователи клиента</h2>

            <ul className="aam_box__list">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`aam_box__list-item ${selectedUserId === user.id ? 'aam_box__list-item--selected' : ''
                            }`}
                        onClick={() => handleSelect(user.id)}
                    >
                        {user.email}
                    </li>
                ))}
            </ul>

            <div className="aam_box__actions">
                <button className="aam_box__button" onClick={goToCreate}>
                    Добавить пользователя
                </button>
                <button
                    className="aam_box__button"
                    onClick={goToEdit}
                    disabled={!selectedUserId}
                >
                    Редактировать пользователя
                </button>
            </div>
        </section>
    );
};

export default ClientUsersBox;