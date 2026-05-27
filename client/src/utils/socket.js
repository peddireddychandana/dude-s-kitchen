import { io } from 'socket.io-client';

const SOCKET_URL = 'https://dude-s-kitchen-server.onrender.com';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 5000,
});

export default socket;
