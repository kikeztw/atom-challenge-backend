import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/authMiddleware';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', taskController.getTasks);
  router.post('/', taskController.createTask);
  router.put('/:id', taskController.updateTask);
  router.delete('/:id', taskController.deleteTask);

  return router;
};
