import { db } from '../db.js';
import { formatDate } from './helper.js';

// async function getMessages(req, res) {
//   try {
//     const logs = await db.message.findAll({
//       where: { roomId: req.body.r },
//     });
//     const mappedLogs = logs.map((l) => ({
//       id: l.id,
//       amount: l.amount,
//       loggedAt: formatDate(l.loggedAt),
//       createdAt: formatDate(l.createdAt),
//     }));
//     return res.status(200).send({
//       messages: mappedLogs,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       message: 'Failed to get Messages',
//     });
//   }
// }

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

// async function editMessage(req, res) {
//   try {
//     const log = db.message.findOne({
//       where: { id: req.params.id },
//     });
//     if (!log) throw new Error('Message does not exist');
//     await db.message.update(req.body, {
//       where: {
//         clientId: req.user.id,
//         id: req.params.id,
//       },
//     });
//     const updatedLog = await db.message.findOne({
//       attributes: ['id', 'loggedAt', 'amount', 'createdAt'],
//       where: { id: req.params.id },
//     });
//     return res.status(200).send({
//       message: 'Message updated successfully',
//       messages: {
//         id: updatedLog.id,
//         loggedAt: formatDate(updatedLog.loggedAt),
//         createdAt: formatDate(updatedLog.createdAt),
//         amount: updatedLog.amount,
//       },
//     });
//   } catch (error) {
//     return res.status(400).send({
//       error: error.message || 'Failed to edit message',
//     });
//   }
// }

// async function removeMessage(req, res) {
//   try {
//     const log = await db.message.findOne({
//       where: {
//         clientId: req.user.id,
//         id: req.params.id,
//       },
//     });

//     if (!log) throw new Error('Message does not exist');

//     await db.message.destroy({
//       where: {
//         clientId: req.user.id,
//         id: req.params.id,
//       },
//     });
//     return res.status(200).send({
//       message: 'Message removed succesfully',
//     });
//   } catch (error) {
//     return res.status(400).send({ message: error.message || 'Failed to remove Message' });
//   }
// }

export {
  // getMessages,
  createMessage,
  // editMessage,
  // removeMessage,
};
