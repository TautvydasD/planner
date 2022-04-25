import { db } from '../db';

function addMessage(data) {
  return db.message.create({ ...data });
}

function getMessages(data) {
  return db.message.findAll({
    where: {
      room: data.room.id,
    },
  });
}

function getRooms(data) {
  return db.room.findAll({
    where: {
      clientId: data.id,
    },
  });
}

function getRoomUsers() {
  return {};
}

export {
  addMessage,
  getMessages,
  getRooms,
  getRoomUsers,
};
