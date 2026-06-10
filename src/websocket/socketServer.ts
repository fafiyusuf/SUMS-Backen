import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

class SocketServer {
  private io: SocketIOServer | null = null;

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // Allow all origins for development to ensure connectivity
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    });

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // GPS updates (standardizing on bus:location_update)
      socket.on('bus:location_update', (data) => {
        this.io?.emit('bus:location_update', data);
      });

      socket.on('gps:update', (data) => {
        this.io?.emit('bus:location_update', data);
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
