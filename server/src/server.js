/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/server
*
*/
import { Server } from 'socket.io';
import http from 'http';
import { app } from './app.js';
import { db } from './db.js';
import { formatDate } from './helpers/index.js';

import { getWgerExercises } from './controllers/exercises.js';

await getWgerExercises();
await db.authenticateDatabase();
// await db.sequelize.sync({ force: true });
// await db.createData();
await db.sequelize.sync();
const server = http.createServer(app);
const io = new Server(server, {
  // cors: {
  //   origin: 'http://192.168.1.204:8080',
  //   methods: ['GET', 'POST'],
  // },
});

app.set('io', io);
io.use((socket, next) => {
  const { user } = socket.handshake.auth;
  if (!user) {
    return next(new Error('User does not exist'));
  }
  /* eslint no-param-reassign: "error" */
  socket.user = user;
  return next();
});

io.on('connection', (socket) => {
  const users = [];
  io.of('/').sockets.forEach((o, i) => {
    users.push({
      userId: i,
      user: o.user,
    });
  });
  socket.emit('users', users);

  socket.broadcast.emit('user_connected', {
    userId: socket.id,
    user: socket.user,
  });

  socket.on('private_message', async ({ content, to }) => {
    console.log(content, to);
    const message = await db.message.create({
      clientId: content.currUserId,
      roomId: content.roomId,
      content: content.content,
    });
    const fixedMessage = {
      id: message.id,
      content: message.content,
      createdAt: formatDate(message.createdAt),
      clientId: message.clientId,
    };
    if (to) {
      socket.to(to).emit('private_message', {
        content: fixedMessage,
        roomId: content.roomId,
        from: socket.id,
      });
    }
    socket.emit('private_message', {
      content: fixedMessage,
      roomId: content.roomId,
      from: socket.id,
    });
  });

  // socket.on('save-message', (message) => {
  //   io.emit('new-message', { message });
  // });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user_disconnected', socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(5000, () => {
  console.log(`✨📡The server is ONLINE 💡. PORT: ${port}📡✨`);
});
