import EmailTemplate from '../models/emailTemplate.js';

const getAll = async (req, res) => {
  const admin_id = req.user.id;
  const templates = await EmailTemplate.getAll(admin_id);
  res.json(templates);
};

const getById = async (req, res) => {
  const template = await EmailTemplate.getById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Шаблон не найден' });
  res.json(template);
};

const create = async (req, res) => {
  const admin_id = req.user.id;
  const { code, name, subject, html, variables = [] } = req.body;
  const id = await EmailTemplate.create({ admin_id, code, name, subject, html, variables });
  res.status(201).json({ message: 'Шаблон создан', id });
};

const update = async (req, res) => {
  const { name, subject, html, variables = [] } = req.body;
  const affected = await EmailTemplate.update(req.params.id, { name, subject, html, variables });
  if (!affected) return res.status(404).json({ message: 'Не удалось обновить' });
  res.json({ message: 'Шаблон обновлён' });
};

const remove = async (req, res) => {
  const affected = await EmailTemplate.delete(req.params.id);
  if (!affected) return res.status(404).json({ message: 'Не найден для удаления' });
  res.json({ message: 'Шаблон удалён' });
};

export default { getAll, getById, create, update, remove };