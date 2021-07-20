import { Router } from 'express';
import { AuthController } from '../controllers';

// eslint-disable-next-line new-cap
const router = Router();

router.post(
    '/register',
    AuthController.validate('register'),
    AuthController.register,
);

router.post('/login', AuthController.validate('login'), AuthController.login);

export default router;
