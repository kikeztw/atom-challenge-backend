import { TaskRepository } from '../repositories/TaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId);
  }

  async createTask(userId: string, taskData: Omit<CreateTaskDTO, 'userId'>): Promise<Task> {
    const createData: CreateTaskDTO = {
      userId,
      title: taskData.title,
      description: taskData.description,
    };

    return await this.taskRepository.create(createData);
  }

  async updateTask(taskId: string, userId: string, taskData: UpdateTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('Unauthorized to update this task');
    }

    const updatedTask = await this.taskRepository.update(taskId, taskData);

    if (!updatedTask) {
      throw new Error('Failed to update task');
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('Unauthorized to delete this task');
    }

    return await this.taskRepository.delete(taskId);
  }
}
