import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import authService from '../services/authService';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, email, phone, password } = req.body;

      const result = await authService.registerPassenger({
        fullName,
        email,
        phone,
        password
      });

      res.status(201).json({
        success: true,
        message: 'Passenger registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, email, phone, password, licenseNumber } = req.body;

      const result = await authService.createDriver({
        fullName,
        email,
        phone,
        password,
        licenseNumber
      });

      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async loginPassenger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, password } = req.body;
      const result = await authService.loginUser(phone, password, 'passenger');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  async loginDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, password } = req.body;
      const result = await authService.loginUser(phone, password, 'driver');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, password } = req.body;
      const result = await authService.loginUser(phone, password, 'admin');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authorization } = req.headers;
      const token = authorization?.split(' ')[1];

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token not provided'
        });
        return;
      }

      const newToken = await authService.refreshToken(token);

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: { token: newToken }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement token blacklisting if needed
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
