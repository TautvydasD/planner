import axios from 'axios';
import { db } from '../db.js';
import { formatDate } from './helper.js';

async function getEvents(req, res) {
  try {
    const content = {};
    if (req.fitbit) {
      const sleepRes = await axios.get('https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=2022-03-25&sort=desc&offset=0&limit=100', {
        headers: { Authorization: req.headers.authorization },
      });
      content.sleep = sleepRes.data.sleep;
    }
    const events = await db.event.findAll({
      where: { clientId: req.user.id },
      raw: true,
    });
    events.forEach((e) => {
      e.startTime = formatDate(e.startTime);
      e.endTime = formatDate(e.endTime);
      e.createdAt = formatDate(e.createdAt);
      e.updatedAt = formatDate(e.updatedAt);
    });
    content.activities = events;
    return res.status(200).send(content);
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to get events',
    });
  }
}

async function createEvent(req, res) {
  try {
    const params = {
      clientId: req.user.id,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      workoutId: req.body.workoutId,
    };
    const event = await db.event.create(params);
    res.status(200).send({
      message: 'Event created successfully',
      event: {
        id: event.id,
        name: event.name,
        type: event.type,
        description: event.description,
        startTime: formatDate(event.startTime),
        endTime: formatDate(event.endTime),
        createdAt: formatDate(event.createdAt),
        workoutId: event.workoutId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errors: [] });
  }
}

async function editEvents(req, res) {
  try {
    const log = db.event.findOne({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    if (!log) throw new Error('Event does not exist');
    await db.event.update(req.body, {
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    const updatedEvent = await db.event.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).send({
      message: 'Event updated successfully',
      event: {
        id: updatedEvent.id,
        name: updatedEvent.name,
        type: updatedEvent.type,
        description: updatedEvent.description,
        startTime: formatDate(updatedEvent.startTime),
        endTime: formatDate(updatedEvent.endTime),
        createdAt: formatDate(updatedEvent.createdAt),
        workoutId: updatedEvent.workoutId,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message || 'Failed to edit water log',
    });
  }
}

async function removeEvents(req, res) {
  try {
    const log = await db.event.findOne({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });

    if (!log) throw new Error('Event does not exist');

    await db.event.destroy({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    return res.status(200).send({
      message: 'Event removed succesfully',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message || 'Failed to remove event' });
  }
}

export {
  getEvents,
  createEvent,
  editEvents,
  removeEvents,
};
