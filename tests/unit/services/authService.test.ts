import { User } from '../../../src/modules/user/user.model';
import { Wallet } from '../../../src/modules/wallet/wallet.model';
import { SmartCard } from '../../../src/modules/card/smartCard.model';
import authService from '../../../src/modules/auth/auth.service';
import bcrypt from 'bcryptjs';

jest.mock('../../../src/modules/user/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../../src/modules/wallet/wallet.model', () => ({
  Wallet: {
    create: jest.fn()
  }
}));

jest.mock('../../../src/modules/card/smartCard.model', () => ({
  SmartCard: {
    create: jest.fn()
  }
}));

jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    })
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerPassenger', () => {
    it('should successfully register a new passenger', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '0912345678',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        id: '123',
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: 'hashedpassword',
        role: 'passenger',
        status: 'active'
      });
      (Wallet.create as jest.Mock).mockResolvedValue({});
      (SmartCard.create as jest.Mock).mockResolvedValue({});

      const result = await authService.registerPassenger(userData);

      expect(result).toHaveProperty('userId', '123');
      expect(result).toHaveProperty('email', userData.email);
      expect(result).toHaveProperty('phone', userData.phone);
      expect(User.create).toHaveBeenCalled();
      expect(Wallet.create).toHaveBeenCalled();
      expect(SmartCard.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists by email', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'existing@example.com',
        phone: '0912345678',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockResolvedValue({ id: '123' });

      await expect(authService.registerPassenger(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user', async () => {
      const phone = '0912345678';
      const password = 'password123';

      const mockUser = {
        id: '123',
        email: 'john@example.com',
        phone,
        password: bcrypt.hashSync(password, 10),
        role: 'passenger',
        status: 'active'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.loginUser(phone, password, 'passenger');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.phone).toBe(phone);
      expect(result.user.role).toBe('passenger');
    });

    it('should throw error for invalid credentials if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser('0900000000', 'password', 'passenger')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if role does not match', async () => {
      const mockUser = {
        id: '123',
        email: 'john@example.com',
        phone: '0912345678',
        password: 'hashedpassword',
        role: 'driver',
        status: 'active'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.loginUser('0912345678', 'password', 'passenger')).rejects.toThrow('Invalid credentials for passenger login');
    });
  });
});
