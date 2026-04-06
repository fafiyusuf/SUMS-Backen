// import { NextFunction, Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import logger from '../utils/logger';

// export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
//     res.status(400).json({
//       success: false,
//       message: 'Validation error',
//       errors: errors.array()
//     });
//     return;
//   }

//   next();
// };

// export default handleValidationErrors;
