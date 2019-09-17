import socket from 'socket.io-client';

let io = null;

export function initIO() {
  io = socket.connect('http://localhost:3000/', {
    transports: ['websocket'],
  });
  return io;
}

export const getIO = () => io;

