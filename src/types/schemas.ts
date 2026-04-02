import { z } from 'zod';

export const authCheckSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export const authRegisterSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export const createTaskSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  completed: z.boolean().optional(),
}).refine((data) => {
  return Object.keys(data).length > 0;
}, {
  message: 'At least one field must be provided for update',
});

export const taskIdSchema = z.string().min(1);

export const userIdHeaderSchema = z.string().min(1);
