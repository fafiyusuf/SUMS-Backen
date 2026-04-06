// import { Socket } from 'socket.io';
// import logger from '../utils/logger';

// export class IncidentHandler {
//   handleIncidentReport(socket: Socket, data: any): void {
//     try {
//       logger.info(`Incident reported: ${data.type} - ${data.severity}`);
//       socket.broadcast.emit('incident:reported', {
//         incidentId: data.incidentId,
//         busId: data.busId,
//         type: data.type,
//         severity: data.severity,
//         description: data.description,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error(`Incident handler error: ${error}`);
//     }
//   }

//   handleIncidentUpdate(socket: Socket, data: any): void {
//     try {
//       socket.broadcast.emit('incident:update', {
//         incidentId: data.incidentId,
//         status: data.status,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error(`Incident update error: ${error}`);
//     }
//   }
// }

// export default new IncidentHandler();
