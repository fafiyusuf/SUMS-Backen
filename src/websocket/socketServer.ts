import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

class SocketServer {
  private io: SocketIOServer | null = null;

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        methods: ['GET', 'POST']
      }
    });

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // GPS events
      socket.on('gps:update', (data) => {
        socket.broadcast.emit('gps:updated', data);
      });

      // ETA events
      socket.on('eta:request', (data) => {
        socket.broadcast.emit('eta:response', data);
      });

      // Incident events
      socket.on('incident:report', (data) => {
        socket.broadcast.emit('incident:reported', data);
      });

      // Trip events
      socket.on('trip:started', (data) => {
        socket.broadcast.emit('trip:status', { ...data, status: 'started' });
      });

      socket.on('trip:completed', (data) => {
        socket.broadcast.emit('trip:status', { ...data, status: 'completed' });
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export default new SocketServer();
