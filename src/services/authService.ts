import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import sequelize from '../database/connection';
import { SmartCard, User, Wallet } from '../models';
import { generateCardId } from '../utils/helpers';
import logger from '../utils/logger';

export interface RegisterUserData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterDriverData extends RegisterUserData {
  licenseNumber: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email?: string | null;
    phone?: string | null;
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

      // Hash password
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);

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
      logger.info(`Passenger registered: ${user.email}`);

      return {
        userId: user.id,
        email: user.email,
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

      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(driverData.password, saltRounds);

      const user = await User.create({
        fullName: driverData.fullName,
        email: driverData.email,
        phone: driverData.phone,
        password: hashedPassword,
        role: 'driver',
        status: 'active'
      });

      logger.info(`Driver created: ${user.email}`);

      return {
        userId: user.id,
        email: user.email,
        fullName: user.fullName
      };
    } catch (error) {
      logger.error(`Driver creation error: ${error}`);
      throw error;
    }
  }

  async loginUser(identifier: string, password: string, requiredRole: string): Promise<LoginResponse> {
    try {
      // Determine whether identifier is email or phone
      const whereClause: any = {};
      if (identifier.includes('@')) {
        whereClause.email = identifier;
      } else {
        whereClause.phone = identifier;
      }

      const user = await User.findOne({ where: whereClause });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (user.role !== requiredRole) {
        throw new Error(`Invalid credentials for ${requiredRole} login`);
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new Error('User account is not active');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      logger.info(`User logged in: ${user.email || user.phone} as ${user.role}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
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

  async refreshToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true }) as any;
      const newToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );
      return newToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }
}

export default new AuthService();
