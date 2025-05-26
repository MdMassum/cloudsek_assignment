import { createServer } from 'http';
import { Server } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import * as cors from 'cors';

const connectedUsers = new Map<string, string>();

export function setupSocket(app: INestApplication) {
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log("Web socket Connected Successfully !!")
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      connectedUsers.set(userId, socket.id);
    }

    socket.on('disconnect', () => {
      connectedUsers.forEach((value, key) => {
        if (value === socket.id) connectedUsers.delete(key);
      });
    });
  });

  global['io'] = io;
  global['connectedUsers'] = connectedUsers;

  return httpServer;
}
