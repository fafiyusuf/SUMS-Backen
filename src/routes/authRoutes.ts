// import express from 'express';
// import authController from '../controllers/authController';
// import verifyToken from '../middleware/authMiddleware';
// import { authLimiter } from '../middleware/rateLimiter';
// import { handleValidationErrors, validateLogin, validateRegister } from '../utils/validators';

// const router = express.Router();

// // Public routes
// router.post('/register', authLimiter, validateRegister, handleValidationErrors, (req, res, next) =>
//   authController.register(req, res, next)
// );

// router.post('/login/passenger', authLimiter, validateLogin, handleValidationErrors, (req, res, next) =>
//   authController.login(req, res, next)
// );

// router.post('/login/driver', authLimiter, validateLogin, handleValidationErrors, (req, res, next) =>
//   authController.login(req, res, next)
// );

// router.post('/login/admin', authLimiter, validateLogin, handleValidationErrors, (req, res, next) =>
//   authController.login(req, res, next)
// );

// // Protected routes
// router.post('/refresh-token', verifyToken, (req, res, next) =>
//   authController.refreshToken(req, res, next)
// );

// router.post('/logout', verifyToken, (req, res, next) =>
//   authController.logout(req, res, next)
// );

// export default router;
