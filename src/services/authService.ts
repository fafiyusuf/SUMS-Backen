// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import config from '../config/env';
// import { SmartCard, User, Wallet } from '../models';
// import { generateCardId } from '../utils/helpers';
// import logger from '../utils/logger';

// export interface RegisterUserData {
//   fullName: string;
//   email: string;
//   phone?: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: {
//     id: string;
//     email: string;
//     fullName: string;
//     role: string;
//   };
// }

// export class AuthService {
//   async registerUser(userData: RegisterUserData): Promise<any> {
//     try {
//       // Check if user exists
//       const existingUser = await User.findOne({ where: { email: userData.email } });
//       if (existingUser) {
//         throw new Error('User already exists');
//       }

//       // Hash password
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

//       // Create user
//       const user = await User.create({
//         fullName: userData.fullName,
//         email: userData.email,
//         phone: userData.phone,
//         password: hashedPassword,
//         role: 'passenger'
//       });

//       // Create wallet
//       await Wallet.create({ userId: user.id, balance: 0, currency: 'ETB' });

//       // Generate smart card
//       const cardId = generateCardId();
//       await SmartCard.create({ cardId, userId: user.id });

//       logger.info(`User registered: ${user.email}`);

//       return {
//         userId: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         cardId
//       };
//     } catch (error) {
//       logger.error(`Registration error: ${error}`);
//       throw error;
//     }
//   }

//   async loginUser(email: string, password: string): Promise<LoginResponse> {
//     try {
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         throw new Error('Invalid credentials');
//       }

//       // Check if user is active
//       if (user.status !== 'active') {
//         throw new Error('User account is not active');
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         throw new Error('Invalid credentials');
//       }

//       const token = jwt.sign(
//         { userId: user.id, role: user.role },
//         config.jwt.secret,
//         { expiresIn: config.jwt.expiresIn }
//       );

//       logger.info(`User logged in: ${user.email}`);

//       return {
//         token,
//         user: {
//           id: user.id,
//           email: user.email,
//           fullName: user.fullName,
//           role: user.role
//         }
//       };
//     } catch (error) {
//       logger.error(`Login error: ${error}`);
//       throw error;
//     }
//   }

//   async verifyToken(token: string): Promise<any> {
//     try {
//       return jwt.verify(token, config.jwt.secret);
//     } catch (error) {
//       throw new Error('Invalid token');
//     }
//   }

//   async refreshToken(token: string): Promise<string> {
//     try {
//       const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true }) as any;
//       const newToken = jwt.sign(
//         { userId: decoded.userId, role: decoded.role },
//         config.jwt.secret,
//         { expiresIn: config.jwt.expiresIn }
//       );
//       return newToken;
//     } catch (error) {
//       throw new Error('Failed to refresh token');
//     }
//   }
// }

// export default new AuthService();
