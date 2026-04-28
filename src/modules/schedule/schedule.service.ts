import { Schedule } from '@/modules/models';

class ScheduleService {
  async getSchedulesByRoute(routeId: string) {
    return await Schedule.findAll({
      where: { routeId },
      order: [
        ['dayOfWeek', 'ASC'],
        ['departureTime', 'ASC']
      ]
    });
  }

  async createSchedule(data: any) {
    return await Schedule.create(data);
  }

  async updateSchedule(scheduleId: string, data: any) {
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return await schedule.update(data);
  }
}

export default new ScheduleService();
