import express from 'express';
import userController from './user.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  updateProfileSchema,
  updateUserStatusSchema,
  getUserSchema,
  getAllUsersSchema
} from './user.schema';

const router = express.Router();

router.use(verifyToken);

router.get('/profile', userController.getProfile);

router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

router.use(requireRole('admin'));

router.get('/', validate(getAllUsersSchema), userController.getAllUsers);

router.get('/:id', validate(getUserSchema), userController.getUser);

router.put('/:id/status', validate(updateUserStatusSchema), userController.updateUserStatus);

export default router;
