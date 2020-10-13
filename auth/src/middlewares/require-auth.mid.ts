import { Request, Response, NextFunction } from 'express';
import { NotAuthError } from '../errors/not-auth.error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser) {
    return next(new NotAuthError());
  }

  next();
};