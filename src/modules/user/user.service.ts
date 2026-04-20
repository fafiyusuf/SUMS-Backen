import User from '@/models/User';

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

  async getAllUsers(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
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
}

export default new UserService();
