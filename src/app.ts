// import cors from 'cors';
// import express, { Express, Request, Response } from 'express';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import config from './config/env';
// import errorHandler from './middleware/errorHandler';
// import { limiter } from './middleware/rateLimiter';
// import routes from './routes';

// const app: Express = express();

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: config.cors.origin,
//   credentials: true
// }));
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Rate limiting
// app.use(limiter);

// // Health check
// app.get('/health', (req: Request, res: Response) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date(),
//     environment: config.env
//   });
// });

// // API Routes
// app.use('/api/v1', routes);

// // 404 Handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Error Handler (must be last)
// app.use(errorHandler);

// export default app;
