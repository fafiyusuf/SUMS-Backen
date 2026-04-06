// import { NextFunction, Request, Response } from 'express';
// import { AuthRequest } from '../middleware/authMiddleware';
// import authService from '../services/authService';

// export class AuthController {
//   async register(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { fullName, email, phone, password } = req.body;

//       const result = await authService.registerUser({
//         fullName,
//         email,
//         phone,
//         password
//       });

//       res.status(201).json({
//         success: true,
//         message: 'User registered successfully',
//         data: result
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async login(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { email, password } = req.body;

//       const result = await authService.loginUser(email, password);

//       res.status(200).json({
//         success: true,
//         message: 'Login successful',
//         data: result
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { authorization } = req.headers;
//       const token = authorization?.split(' ')[1];

//       if (!token) {
//         res.status(400).json({
//           success: false,
//           message: 'Token not provided'
//         });
//         return;
//       }

//       const newToken = await authService.refreshToken(token);

//       res.status(200).json({
//         success: true,
//         message: 'Token refreshed',
//         data: { token: newToken }
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       // TODO: Implement token blacklisting if needed
//       res.status(200).json({
//         success: true,
//         message: 'Logout successful'
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default new AuthController();
