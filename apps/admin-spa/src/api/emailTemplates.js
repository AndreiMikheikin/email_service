import apiClient, { handleError } from './clientUsers'; // Переиспользуем общую конфигурацию

// Получить все шаблоны
export const getEmailTemplates = async () => {
  try {
    const response = await apiClient.get('/api/adminDashboard/emailTemplates');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Создать новый шаблон
export const createEmailTemplate = async ({ name, subject, body }) => {
  try {
    const response = await apiClient.post('/api/adminDashboard/emailTemplates/create', {
      name,
      subject,
      body,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Обновить шаблон
export const updateEmailTemplate = async (id, { name, subject, body }) => {
  try {
    const response = await apiClient.put(`/api/adminDashboard/emailTemplates/edit/${id}`, {
      name,
      subject,
      body,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Удалить шаблон
export const deleteEmailTemplate = async (id) => {
  try {
    const response = await apiClient.delete(`/api/adminDashboard/emailTemplates/delete/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};