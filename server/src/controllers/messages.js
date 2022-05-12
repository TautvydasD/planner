/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/messages
*
*/
import { db } from '../db.js';
import { formatDate } from '../helpers/index.js';

async function createMessage(req, res) {
  try {
    const message = await db.message.create({
      ...req.body,
    });

    return res.status(201).send({
      message: 'Message created succcessfully',
      messageInstance: {
        id: message.id,
        username: message.username,
        content: message.content,
        createdAt: formatDate(message.createdAt),
        roomId: message.roomId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: 'Failed to create message',
    });
  }
}

export {
  createMessage,
};
