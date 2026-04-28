import logger from '../../utils/logger';
import { Incident } from './incident.model';

export class IncidentService {
  async reportIncident(data: { busId: string; type: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string; reportedBy: string }) {
    const incident = await Incident.create({
      ...data,
      status: 'open'
    });
    logger.info(`Incident reported: ${incident.id} - ${data.severity}`);
    return incident;
  }

  async getIncident(id: string) {
    const incident = await Incident.findByPk(id);
    if (!incident) throw new Error('Incident not found');
    return incident;
  }

  async getAllIncidents(page: number, limit: number, status?: string, severity?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (severity) where.severity = severity;

    const incidents = await Incident.findAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const total = await Incident.count({ where });

    return { incidents, total, page, limit };
  }

  async updateIncidentStatus(id: string, status: 'open' | 'acknowledged' | 'resolved') {
    const incident = await Incident.findByPk(id);
    if (!incident) throw new Error('Incident not found');
    await incident.update({ status });
    return incident;
  }
}

export default new IncidentService();
