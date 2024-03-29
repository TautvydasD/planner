import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';
const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
