import express, { Express, Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import { UserRepository } from './repositories/UserRepository';
import { TaskRepository } from './repositories/TaskRepository';
import { AuthService } from './services/AuthService';
import { TaskService } from './services/TaskService';
import { AuthController } from './controllers/AuthController';
import { TaskController } from './controllers/TaskController';
import { createAuthRoutes } from './routes/authRoutes';
import { createTaskRoutes } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (db: Firestore): Express => {
  const app = express();

  app.use(express.json());

  const userRepository = new UserRepository(db);
  const taskRepository = new TaskRepository(db);

  const authService = new AuthService(userRepository);
  const taskService = new TaskService(taskRepository);

  const authController = new AuthController(authService);
  const taskController = new TaskController(taskService);

  const apiRouter = Router();
  apiRouter.use('/auth', createAuthRoutes(authController));
  apiRouter.use('/tasks', createTaskRoutes(taskController));

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
};
