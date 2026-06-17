import User from './user.model';

export class UserService {
  async getProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, data: { fullName?: string; phone?: string }) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    if (data.fullName) user.fullName = data.fullName;
    if (data.phone) user.phone = data.phone;

    await user.save();

    const userData = user.toJSON();
    delete (userData as any).password;
    return userData;
  }

  async getAllUsers(page: number, limit: number, role?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (role) {
      where.role = role;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      users: rows
    };
  }

  async getUser(id: string) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserStatus(id: string, status: 'active' | 'suspended' | 'inactive') {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    user.status = status;
    await user.save();

    const userData = user.toJSON();
    delete (userData as any).password;
    return userData;
  }

  async updateUser(id: string, data: { fullName?: string; email?: string; role?: 'admin' | 'driver' | 'passenger'; status?: 'active' | 'suspended' | 'inactive' }) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    if (data.fullName !== undefined) user.fullName = data.fullName;
    if (data.email !== undefined) user.email = data.email;
    if (data.role !== undefined) user.role = data.role;
    if (data.status !== undefined) user.status = data.status;

    await user.save();

    const userData = user.toJSON();
    delete (userData as any).password;
    return userData;
  }

  async createUser(data: any) {
    const existingEmail = await User.findOne({ where: { email: data.email } });
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    if (data.phone) {
      const existingPhone = await User.findOne({ where: { phone: data.phone } });
      if (existingPhone) {
        throw new Error('Phone number already in use');
      }
    }

    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(data.password, saltRounds);

    const { sequelize } = require('../../config/database');
    const { Wallet } = require('../wallet/wallet.model');
    const { SmartCard } = require('../card/smartCard.model');
    const { generateCardId } = require('../../utils/helpers');

    const transaction = await sequelize.transaction();
    try {
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        password: hashedPassword,
        role: data.role,
        status: data.status || 'active'
      }, { transaction });

      if (data.role === 'passenger') {
        // Create wallet
        await Wallet.create({ userId: user.id, balance: 0, currency: 'ETB' }, { transaction });

        // Generate smart card
        const cardId = generateCardId();
        await SmartCard.create({ cardId, userId: user.id, status: 'ACTIVE', activatedAt: new Date() }, { transaction });
      }

      await transaction.commit();

      const userData = user.toJSON();
      delete (userData as any).password;
      return userData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserSummary() {
    const total = await User.count();

    // Role distribution
    const admins = await User.count({ where: { role: 'admin' } });
    const drivers = await User.count({ where: { role: 'driver' } });
    const passengers = await User.count({ where: { role: 'passenger' } });

    // Status summary
    const active = await User.count({ where: { status: 'active' } });
    const inactive = await User.count({ where: { status: 'inactive' } });
    const suspended = await User.count({ where: { status: 'suspended' } });

    return {
      total,
      roles: { admin: admins, driver: drivers, passenger: passengers },
      status: { active, inactive, suspended }
    };
  }
}


export default new UserService();
