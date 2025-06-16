export async function sendEmail(data) {
  const response = await fetch('http://178.250.247.67:3000/api/client/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include', // если есть авторизация через cookie
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при отправке email');
  }

  return response.json();
}