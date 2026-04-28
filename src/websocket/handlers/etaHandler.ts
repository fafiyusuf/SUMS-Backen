// import { Socket } from 'socket.io';
// import logger from '../utils/logger';

// export class ETAHandler {
//   handleETARequest(socket: Socket, data: any): void {
//     try {
//       logger.info(`ETA request for ${data.busId}`);
//       socket.broadcast.emit('eta:response', {
//         busId: data.busId,
//         estimatedTime: data.estimatedTime,
//         distance: data.distance,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error(`ETA handler error: ${error}`);
//     }
//   }

//   handleETAUpdate(socket: Socket, data: any): void {
//     try {
//       socket.broadcast.emit('eta:update', {
//         busId: data.busId,
//         eta: data.eta,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error(`ETA update error: ${error}`);
//     }
//   }
// }

// export default new ETAHandler();
