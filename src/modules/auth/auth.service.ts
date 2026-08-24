import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import sequelize from '../../database/connection';
import { generateCardId } from '../../utils/helpers';
import logger from '../../utils/logger';
import { SmartCard } from '../card/smartCard.model';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';

export interface RegisterUserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterDriverData extends RegisterUserData {
  licenseNumber: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export class AuthService {
  async registerPassenger(userData: RegisterUserData): Promise<any> {
    const transaction = await sequelize.transaction();
    try {
      // Check if user exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      if (userData.phone) {
        const existingPhone = await User.findOne({ where: { phone: userData.phone } });
        if (existingPhone) {
          throw new Error('Phone number already in use');
        }
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await User.create({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        role: 'passenger',
        status: 'active'
      }, { transaction });

      // Create wallet
      await Wallet.create({ userId: user.id, balance: 0, currency: 'ETB' }, { transaction });

      // Generate smart card
      const cardId = generateCardId();
      await SmartCard.create({ cardId, userId: user.id, status: 'ACTIVE', activatedAt: new Date() } as any, { transaction });

      await transaction.commit();
      logger.info(`Passenger registered: ${user.phone}`);

      return {
        userId: user.id,
        email: user.email,
        phone: user.phone ?? userData.phone,
        fullName: user.fullName,
        cardId
      };
    } catch (error) {
      await transaction.rollback();
      logger.error(`Passenger registration error: ${error}`);
      throw error;
    }
  }

  async createDriver(driverData: RegisterDriverData): Promise<any> {
    try {
      const existingUser = await User.findOne({ where: { email: driverData.email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      if (driverData.phone) {
        const existingPhone = await User.findOne({ where: { phone: driverData.phone } });
        if (existingPhone) {
          throw new Error('Phone number already in use');
        }
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(driverData.password, saltRounds);

      const user = await User.create({
        fullName: driverData.fullName,
        email: driverData.email,
        phone: driverData.phone,
        password: hashedPassword,
        role: 'driver',
        status: 'active'
      });

      logger.info(`Driver created: ${user.phone}`);

      return {
        userId: user.id,
        email: user.email,
        phone: driverData.phone ?? driverData.phone,
        fullName: user.fullName
      };
    } catch (error) {
      logger.error(`Driver creation error: ${error}`);
      throw error;
    }
  }

  async loginUser(phone: string, password: string, requiredRole: string): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        const err = new Error('Invalid credentials') as any;
        err.status = 401;
        throw err;
      }

      if (!user.phone) {
        const err = new Error('User phone number is missing') as any;
        err.status = 400;
        throw err;
      }

      if (user.role !== requiredRole) {
        const err = new Error(`Invalid credentials for ${requiredRole} login`) as any;
        err.status = 401;
        throw err;
      }

      // Check if user is active
      if (user.status !== 'active') {
        const err = new Error('User account is not active') as any;
        err.status = 403;
        throw err;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const err = new Error('Invalid credentials') as any;
        err.status = 401;
        throw err;
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role, phone: user.phone || null },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn as any }
      );

      logger.info(`User logged in: ${user.phone} as ${user.role}`);

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      };
    } catch (error) {
      logger.error(`Login error: ${error}`);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
      const user = await User.findByPk(decoded.userId);

      if (!user || user.status !== 'active') {
        const err = new Error('User not found or inactive') as any;
        err.status = 401;
        throw err;
      }

      const newToken = jwt.sign(
        { userId: user.id, role: user.role, phone: user.phone || null },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn as any }
      );

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      const err = new Error('Invalid refresh token') as any;
      err.status = 401;
      throw err;
    }
  }


}

export default new AuthService();
