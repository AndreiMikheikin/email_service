import { Router } from 'express';
import emailTemplateController from '../controllers/emailTemplateController.js';
import auth, { adminOnlyMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(auth, adminOnlyMiddleware);

router.get('/', emailTemplateController.getAll);
router.get('/:id', emailTemplateController.getById);
router.post('/', emailTemplateController.create);
router.put('/:id', emailTemplateController.update);
router.delete('/:id', emailTemplateController.remove);

export default router;