import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorResponse: ErrorResponse = {
    error: err.message || 'Internal server error',
    code: 'SERVER_ERROR',
  };

  res.status(500).json(errorResponse);
};
