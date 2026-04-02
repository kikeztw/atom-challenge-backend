import { Response } from 'express';
import { TaskService } from '../services/TaskService';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../types/schemas';
import { ZodError } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const tasks = await this.taskService.getUserTasks(userId);
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskData = createTaskSchema.parse({ ...req.body, userId });
      const task = await this.taskService.createTask(userId, taskData);
      res.status(201).json({ task });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid task data', code: 'VALIDATION_ERROR' });
        return;
      }
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskId = taskIdSchema.parse(req.params.id);
      const taskData = updateTaskSchema.parse(req.body);
      
      const task = await this.taskService.updateTask(taskId, userId, taskData);
      res.status(200).json({ task });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid task data or ID', code: 'VALIDATION_ERROR' });
        return;
      }
      if (error instanceof Error) {
        if (error.message === 'Task not found') {
          res.status(404).json({ error: 'Task not found', code: 'TASK_NOT_FOUND' });
          return;
        }
        if (error.message === 'Unauthorized to update this task') {
          res.status(403).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
          return;
        }
      }
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const taskId = taskIdSchema.parse(req.params.id);
      
      const success = await this.taskService.deleteTask(taskId, userId);
      res.status(200).json({ success });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid task ID', code: 'VALIDATION_ERROR' });
        return;
      }
      if (error instanceof Error) {
        if (error.message === 'Task not found') {
          res.status(404).json({ error: 'Task not found', code: 'TASK_NOT_FOUND' });
          return;
        }
        if (error.message === 'Unauthorized to delete this task') {
          res.status(403).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
          return;
        }
      }
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };
}
