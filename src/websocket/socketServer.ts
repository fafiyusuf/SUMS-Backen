import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

class SocketServer {
  private io: SocketIOServer | null = null;

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
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

      // Handle bus-specific subscriptions as requested
      socket.on('subscribe-bus', (busId: string) => {
        socket.join(`bus-${busId}`);
        console.log(`Socket ${socket.id} joined room bus-${busId}`);
      });

      // Maintain general events
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
