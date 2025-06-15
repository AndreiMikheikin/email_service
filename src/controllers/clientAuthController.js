import poolOfUsers from '../models/poolOfUsers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const clientAuthController = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await poolOfUsers.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      const token = jwt.sign(
        {
          user_id: user.id,
          admin_id: user.admin_id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

export default clientAuthController;