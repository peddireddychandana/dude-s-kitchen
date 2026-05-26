import { io } from 'socket.io-client';

const SOCKET_URL = 'https://dude-s-kitchen-server.onrender.com';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export default socket;
