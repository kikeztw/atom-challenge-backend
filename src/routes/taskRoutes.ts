import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.get('/', taskController.getTasks);
  router.post('/', taskController.createTask);
  router.put('/:id', taskController.updateTask);
  router.delete('/:id', taskController.deleteTask);

  return router;
};
