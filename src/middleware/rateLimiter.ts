import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,//15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 20 requests per windowMs
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
  statusCode: 429
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 30 requests per minute
  message: 'Too many API requests, please try again later.',
  statusCode: 429
});

export default { limiter, authLimiter, apiLimiter };
