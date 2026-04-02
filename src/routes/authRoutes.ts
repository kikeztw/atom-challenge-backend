import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/check', authController.checkEmail);
  router.post('/register', authController.register);

  return router;
};
