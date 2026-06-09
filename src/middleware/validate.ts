import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import logger from '../utils/logger';

export const validate = (schema: ZodSchema<any>) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error && (error.errors || error.issues || error.name === 'ZodError')) {
        const issues = error.errors || error.issues || [];
        logger.warn(`Validation error: ${JSON.stringify(issues)}`);
        
        // Format to match old express-validator response shape for client compatibility
        const formattedErrors = issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
        return;
      }
      return next(error);
    }
  };

export default validate;
