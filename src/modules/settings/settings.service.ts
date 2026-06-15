import { SystemSetting } from '../models';

export class SettingsService {
    async getSetting(key: string, defaultValue: string): Promise<string> {
        const setting = await SystemSetting.findOne({ where: { key } });
        return setting ? setting.value : defaultValue;
    }

    async getNumericSetting(key: string, defaultValue: number): Promise<number> {
        const value = await this.getSetting(key, defaultValue.toString());
        return parseFloat(value);
    }

    async updateSetting(key: string, value: string, adminId: string, description?: string) {
        let setting = await SystemSetting.findOne({ where: { key } });

        if (setting) {
            return await setting.update({ value, updatedBy: adminId, description: description || setting.description });
        } else {
            return await SystemSetting.create({ key, value, updatedBy: adminId, description: description || null });
        }
    }

    async getAllSettings() {
        return await SystemSetting.findAll({
            include: [{ model: require('../user/user.model').User, as: 'admin', attributes: ['fullName', 'email'] }]
        });
    }
}

export default new SettingsService();
