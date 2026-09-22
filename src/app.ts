import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from './config/env';
import { swaggerSpec } from './config/swagger';
import errorHandler from './middleware/errorHandler';
import { limiter } from './middleware/rateLimiter';
import routes from './routes';

const app: Express = express();

// Trust proxy for rate limiting (needed for ngrok/proxies)
app.set('trust proxy', 1);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
};

// Preflight options specific handling
app.options('*', cors(corsOptions));
// Main application middleware handling
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: config.env
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;
