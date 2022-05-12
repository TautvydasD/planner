/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/services/socket
*
*/
import { io } from 'socket.io-client';

const URL = 'http://192.168.1.204:5000';
const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
