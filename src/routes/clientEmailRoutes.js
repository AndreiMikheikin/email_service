import { Router } from 'express';
import { sendClientEmail } from '../controllers/clientEmailController.js';
import { clientAuth } from '../middlewares/clientAuth.js';
import { clientRateLimit } from '../middlewares/clientRateLimit.js';

const router = Router();

router.post('/send-email', clientAuth, clientRateLimit, sendClientEmail);

export default router;