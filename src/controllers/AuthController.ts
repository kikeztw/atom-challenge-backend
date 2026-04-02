import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { authCheckSchema, authRegisterSchema } from '../types/schemas';
import { ZodError } from 'zod';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  checkEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = authCheckSchema.parse(req.body);
      const result = await this.authService.checkUserExists(validatedData.email);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid email format', code: 'VALIDATION_ERROR' });
        return;
      }
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = authRegisterSchema.parse(req.body);
      const result = await this.authService.registerUser(validatedData.email);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid email format', code: 'VALIDATION_ERROR' });
        return;
      }
      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({ error: 'User already exists', code: 'USER_EXISTS' });
        return;
      }
      res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
    }
  };
}
