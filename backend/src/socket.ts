import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket: Socket) => {
    console.log('socket connected', socket.id);

    socket.on('joinDriver', (driverId: string) => {
      socket.join(`driver:${driverId}`);
    });

    socket.on('driverLocation', (payload) => {
      io.to(`operator`).emit('driverLocation', payload);
    });

    socket.on('statusUpdate', (payload) => {
      io.emit('statusUpdate', payload);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
}

export function emitToDriver(driverId: string, event: string, payload: any) {
  if (!io) return;
  io.to(`driver:${driverId}`).emit(event, payload);
}

export function emitToOperators(event: string, payload: any) {
  if (!io) return;
  io.to('operator').emit(event, payload);
}
