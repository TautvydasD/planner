/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/rooms
*
*/
import { Op } from 'sequelize';
import { db } from '../db.js';
import { formatDate } from '../helpers/index.js';

async function getRooms(req, res) {
  try {
    const rooms = await db.room.findAll({
      where: {
        [Op.or]: [
          { clientId: req.user.id },
          { toClientId: req.user.id },
        ],
      },
    });
    const fixedRooms = await Promise.all(rooms.map(async (r) => {
      let currUser = {};
      let toUser = {};
      if (req.user.id === r.clientId) {
        currUser = await db.client.findByPk(r.clientId);
        toUser = await db.client.findByPk(r.toClientId);
      } else {
        currUser = await db.client.findByPk(r.toClientId);
        toUser = await db.client.findByPk(r.clientId);
      }
      const messages = await db.message.findAll({
        where: { roomId: r.id },
      });
      const fixedMessages = messages.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: formatDate(m.createdAt),
        clientId: m.clientId,
      }));
      return {
        id: r.id,
        currUser: {
          id: currUser.id,
          email: currUser.email,
          username: currUser.username,
        },
        toUser: {
          id: toUser.id,
          email: toUser.email,
          username: toUser.username,
        },
        createdAt: formatDate(r.createdAt),
        messages: fixedMessages,
      };
    }));
    return res.status(200).send({
      rooms: fixedRooms,
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed to get rooms',
    });
  }
}

async function createRoom(req, res) {
  try {
    const newRoom = await db.room.create({
      clientId: req.user.id,
      ...req.body,
    });

    return res.status(201).send({
      message: 'Room created succcessfully',
      room: {
        id: newRoom.id,
        responder: newRoom.responder,
        createdAt: formatDate(newRoom.createdAt),
        clientId: newRoom.clientId,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create room',
    });
  }
}

async function editRoom(req, res) {
  try {
    return res.status(200).send({
      message: 'Room updated successfully',
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message || 'Failed to edit room',
    });
  }
}

async function removeRoom(req, res) {
  try {
    return res.status(200).send({
      message: 'Room removed succesfully',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message || 'Failed to remove room' });
  }
}

export {
  getRooms,
  createRoom,
  editRoom,
  removeRoom,
};
