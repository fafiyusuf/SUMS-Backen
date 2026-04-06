// import { NextFunction, Request, Response } from 'express';
// import logger from '../utils/logger';

// interface ApiError extends Error {
//   status?: number;
//   statusCode?: number;
// }

// export const errorHandler = (
//   err: ApiError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const status = err.status || err.statusCode || 500;
//   const message = err.message || 'Internal server error';

//   logger.error(`Error: ${status} - ${message}`);

//   res.status(status).json({
//     success: false,
//     message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// };

// export default errorHandler;
