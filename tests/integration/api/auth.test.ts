import request from 'supertest';
import app from '../../../src/app';
import { User, Wallet, SmartCard } from '../../../src/modules/models';
import sequelize from '../../../src/database/connection';
import bcrypt from 'bcryptjs';

describe('Auth API Integration', () => {
  let transactionMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    transactionMock = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined)
    };

    jest.spyOn(sequelize, 'transaction').mockResolvedValue(transactionMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new passenger', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue({
        id: '123',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0912345678',
        role: 'passenger',
        status: 'active'
      } as any);
      jest.spyOn(Wallet, 'create').mockResolvedValue({} as any);
      jest.spyOn(SmartCard, 'create').mockResolvedValue({} as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '0912345678',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('userId', '123');
      expect(User.create).toHaveBeenCalled();
      expect(transactionMock.commit).toHaveBeenCalled();
    });

    it('should return 400 for validation errors (invalid email)', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Test User',
          email: 'invalid-email',
          phone: '0912345678',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/auth/login/passenger', () => {
    it('should successfully login passenger', async () => {
      const phone = '0912345678';
      const password = 'password123';
      const hashedPassword = bcrypt.hashSync(password, 10);

      jest.spyOn(User, 'findOne').mockResolvedValue({
        id: '123',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone,
        password: hashedPassword,
        role: 'passenger',
        status: 'active'
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login/passenger')
        .send({
          phone,
          password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('role', 'passenger');
    });

    it('should return 401 for invalid credentials', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login/passenger')
        .send({
          phone: '0900000000',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
