import React, { useState } from 'react';
import { createEmailTemplate } from '../api/emailTemplates';

const AddTemplateModal = ({ isOpen, onClose, onTemplateAdded }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !subject || !body) {
      setError('Заполните все поля');
      return;
    }
    try {
      await createEmailTemplate({ name, subject, body });
      onTemplateAdded();
    } catch (err) {
      setError('Ошибка при создании шаблона: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="aam_modal">
      <div className="aam_modal__content">
        <h2>Добавить шаблон письма</h2>
        {error && <p className="aam_modal__error">{error}</p>}
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="aam_modal__input"
        />
        <input
          type="text"
          placeholder="Тема письма"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="aam_modal__input"
        />
        <textarea
          placeholder="HTML тела письма"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="aam_modal__textarea"
        />
        <div className="aam_modal__actions">
          <button className="aam_modal__button" onClick={handleSubmit}>Сохранить</button>
          <button className="aam_modal__button" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default AddTemplateModal;