import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import userService from './user.service';

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const user = await userService.getProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { fullName, phone } = req.body;
      const updatedUser = await userService.updateProfile(userId, { fullName, phone });
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await userService.getAllUsers(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await userService.updateUserStatus(id, status);
      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { fullName, email, role, status } = req.body;
      const result = await userService.updateUser(id, { fullName, email, role, status });
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, phone, password, role, status } = req.body;
      const result = await userService.createUser({ fullName, email, phone, password, role, status });
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'Email already in use' || error.message === 'Phone number already in use') {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: error.message || 'Server Error', error });
    }
  }
}


export default new UserController();
