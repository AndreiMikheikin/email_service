import EmailSendLog from '../models/emailSendLog.js';

export const clientRateLimit = async (req, res, next) => {
  const { admin_id } = req.user;

  try {
    const todayCount = await EmailSendLog.countToday(admin_id);
    const monthCount = await EmailSendLog.countThisMonth(admin_id);

    if (todayCount >= 10) {
      return res.status(429).json({ error: 'Достигнут дневной лимит (10 писем)' });
    }

    if (monthCount >= 100) {
      return res.status(429).json({ error: 'Достигнут месячный лимит (100 писем)' });
    }

    next();
  } catch (err) {
    console.error('Ошибка проверки лимита:', err);
    res.status(500).json({ error: 'Ошибка проверки лимита' });
  }
};