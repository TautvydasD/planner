import { Op } from 'sequelize';

import { db } from '../db.js';
import { formatDate } from './helper.js';

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
    // include: [{
    //   model: db.message,
    //   as: 'messages',
    // }],
    // nest: true,
    // const mappedLogs = rooms.map((l) => ({
    //   id: l.id,
    //   responder: l.responder,
    //   createdAt: formatDate(l.createdAt),
    //   messages: l.messages.map((m) => ({
    //     createdAt: formatDate(m.createdAt),
    //     content: m.content,
    //     roomId: m.roomId,
    //     id: m.id,
    //     username: m.username,
    //     clientId: m.clientId,
    //   })),
    // }));
    return res.status(200).send({
      rooms: fixedRooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: 'Failed to get rooms',
    });
  }
}

async function createRoom(req, res) {
  try {
    // const room = await db.room.findOne({
    //   where: {
    //     [Op.or]: [
    //       { clientId: req.user.id },
    //       { responder: String(req.user.id) },
    //     ],
    //   },
    // });
    // console.log(room);
    // if (room) throw new Error('');
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
    console.log(error);
    return res.status(400).send({
      error: 'Failed to create room',
    });
  }
}

async function editRoom(req, res) {
  try {
    // const log = db.room.findOne({
    //   where: { id: req.params.id },
    // });
    // if (!log) throw new Error('Room does not exist');
    // await db.room.update(req.body, {
    //   where: {
    //     clientId: req.user.id,
    //     id: req.params.id,
    //   },
    // });
    // const updatedLog = await db.room.findOne({
    //   attributes: ['id', 'loggedAt', 'amount', 'createdAt'],
    //   where: { id: req.params.id },
    // });
    return res.status(200).send({
      message: 'Room updated successfully',
      // room: {
      //   id: updatedLog.id,
      //   loggedAt: formatDate(updatedLog.loggedAt),
      //   createdAt: formatDate(updatedLog.createdAt),
      //   amount: updatedLog.amount,
      // },
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message || 'Failed to edit room',
    });
  }
}

async function removeRoom(req, res) {
  try {
    // const log = await db.room.findOne({
    //   where: {
    //     clientId: req.user.id,
    //     id: req.params.id,
    //   },
    // });

    // if (!log) throw new Error('Room does not exist');

    // await db.room.destroy({
    //   where: {
    //     clientId: req.user.id,
    //     id: req.params.id,
    //   },
    // });
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
