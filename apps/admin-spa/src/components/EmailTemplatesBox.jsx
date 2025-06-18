import React, { useEffect, useState } from 'react';
import { getEmailTemplates } from '../api/emailTemplates';
import '../styles/components/_emailTemplateBox.scss';

// передаём пропсы аналогично ClientUsersBox
const EmailTemplatesBox = ({ onAddClick, onEditClick, reloadFlag }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getEmailTemplates();
        console.log('Полученные шаблоны:', data);
        setTemplates(data.templates);
      } catch (err) {
        console.error('Ошибка при получении шаблонов:', err.message);
      }
    };

    fetchTemplates();
  }, [reloadFlag]);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleEditClick = () => {
    const selected = templates.find((tpl) => tpl.id === selectedId);
    if (selected) onEditClick(selected);
  };

  return (
    <section className="aam_box">
      <h2 className="aam_box__title">Шаблоны писем</h2>

      {Array.isArray(templates) && templates.length > 0 ? (
        <ul className="aam_box__list">
          {templates.map((tpl) => (
            <li
              key={tpl.id}
              className={`aam_box__list-item ${selectedId === tpl.id ? 'aam_box__list-item--selected' : ''}`}
              onClick={() => handleSelect(tpl.id)}
            >
              {tpl.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="aam_box__list-empty">Нет доступных шаблонов.</p>
      )}

      <div className="aam_box__actions">
        <button className="aam_box__button" onClick={onAddClick}>
          Добавить шаблон
        </button>
        <button
          className="aam_box__button"
          onClick={handleEditClick}
          disabled={!selectedId}
        >
          Редактировать шаблон
        </button>
      </div>
    </section>
  );
};

export default EmailTemplatesBox;