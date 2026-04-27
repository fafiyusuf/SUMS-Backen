// import { Socket } from 'socket.io';
// import logger from '../utils/logger';

// export class GPSHandler {
//   handleGPSUpdate(socket: Socket, data: any): void {
//     try {
//       logger.info(`GPS update from ${data.busId}`);
//       socket.broadcast.emit('gps:updated', {
//         busId: data.busId,
//         latitude: data.latitude,
//         longitude: data.longitude,
//         timestamp: new Date(),
//         ...data
//       });
//     } catch (error) {
//       logger.error(`GPS handler error: ${error}`);
//     }
//   }

//   handleLocationShare(socket: Socket, data: any): void {
//     try {
//       socket.broadcast.emit('location:received', {
//         userId: data.userId,
//         latitude: data.latitude,
//         longitude: data.longitude,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error(`Location share error: ${error}`);
//     }
//   }
// }

// export default new GPSHandler();
