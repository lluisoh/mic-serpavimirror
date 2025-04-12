// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const isKnownError = err instanceof AppError;

  const status = isKnownError ? err.status : 500;
  const message = isKnownError ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Error:', err.message);
  }

  res.status(status).json({
    error: true,
    message,
  });
}
