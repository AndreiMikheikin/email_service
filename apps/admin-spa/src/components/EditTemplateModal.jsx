import React, { useState, useEffect } from 'react';
import { updateEmailTemplate, deleteEmailTemplate } from '../api/emailTemplates';

const EditTemplateModal = ({
  isOpen,
  onClose,
  template,
  onTemplateUpdated,
  onTemplateDeleted,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [body, setBody] = useState(template?.body || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [template]);

  const handleUpdate = async () => {
    if (!name || !subject || !body) {
      setError('Заполните все поля');
      return;
    }
    try {
      await updateEmailTemplate(template.id, { name, subject, body });
      onTemplateUpdated();
    } catch (err) {
      setError('Ошибка при обновлении: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить этот шаблон?')) return;
    try {
      await deleteEmailTemplate(template.id);
      onTemplateDeleted();
    } catch (err) {
      setError('Ошибка при удалении: ' + err.message);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="aam_modal">
      <div className="aam_modal__content">
        <h2>Редактировать шаблон</h2>
        {error && <p className="aam_modal__error">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="aam_modal__input"
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="aam_modal__input"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="aam_modal__textarea"
        />
        <div className="aam_modal__actions">
          <button className="aam_modal__button" onClick={handleUpdate}>Сохранить</button>
          <button className="aam_modal__button" onClick={handleDelete}>Удалить</button>
          <button className="aam_modal__button" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default EditTemplateModal;