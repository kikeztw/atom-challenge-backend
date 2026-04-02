export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface AuthCheckResponse {
  exists: boolean;
  user?: User;
  token?: string;
}

export interface AuthRegisterResponse {
  user: User;
  token: string;
}

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface ErrorResponse {
  error: string;
  code?: string;
}
