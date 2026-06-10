import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import authService from './auth.service';

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
      const { email, phone, password } = req.body;
      const identifier = email || phone;
      const result = await authService.loginUser(identifier, password, 'passenger');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  async loginDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phone, password } = req.body;
      const identifier = email || phone;
      const result = await authService.loginUser(identifier, password, 'driver');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phone, password } = req.body;
      const identifier = email || phone;
      const result = await authService.loginUser(identifier, password, 'admin');
      res.status(200).json({ success: true, message: 'Login successful', data: result });
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
