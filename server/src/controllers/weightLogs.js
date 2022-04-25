import axios from 'axios';
import { db } from '../db.js';
import { formatDate } from './helper.js';

async function getWeightLogs(req, res) {
  try {
    const logs = await db.weightLog.findAll({
      where: { clientId: req.user.id },
    });
    const mappedLogs = logs.map((l) => ({
      id: l.id,
      weight: l.weight,
      bodyFat: l.bodyFat,
      loggedAt: formatDate(l.loggedAt),
      createdAt: formatDate(l.createdAt),
    }));
    return res.status(200).send({
      weightLogs: mappedLogs,
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed to get weight logs',
    });
  }
}

function getParamsForFitbit(body) {
  const [date, time] = formatDate(body.loggedAt).split(' ');
  return {
    weight: body.weight,
    date,
    time,
    bodyFat: body.bodyFat,
  };
}

async function createWeightLog(req, res) {
  try {
    const log = await db.weightLog.create({
      clientId: req.user.id,
      ...req.body,
    });
    const {
      date,
      weight,
      bodyFat,
      time,
    } = getParamsForFitbit(log);
    if (req.fitbit) {
      const { data } = await axios.post(`https://api.fitbit.com/1/user/-/body/log/weight.json?date=${date}&weight=${weight}`, {}, {
        headers: { Authorization: req.headers.authorization },
      });
      await db.weightLog.update({
        fbWeightId: data.weightLog.logId,
      }, {
        where: {
          id: log.id,
          clientId: req.user.id,
        },
      });
    }
    if (req.fitbit && bodyFat) {
      const { data } = await axios.post(`https://api.fitbit.com/1/user/-/body/log/fat.json?date=${date}&fat=${bodyFat}&time=${time}`, {}, {
        headers: { Authorization: req.headers.authorization },
      });
      await db.weightLog.update({
        fbBodyFatId: data.fatLog.logId,
      }, {
        where: {
          id: log.id,
          clientId: req.user.id,
        },
      });
    }
    return res.status(201).send({
      message: 'Weight log created succcessfully',
      weightLog: {
        id: log.id,
        weight: log.weight,
        bodyFat: log.bodyFat,
        loggedAt: formatDate(log.loggedAt),
        createdAt: formatDate(log.createdAt),
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create weight log',
    });
  }
}

async function editWeightLog(req, res) {
  try {
    const log = db.weightLog.findOne({
      where: { id: req.params.id },
    });
    if (!log) throw new Error('Weight log does not exist');
    await db.weightLog.update(req.body, {
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    const updatedLog = await db.weightLog.findOne({
      where: { id: req.params.id },
    });
    const { date, weight } = getParamsForFitbit(updatedLog);
    if (req.fitbit) {
      console.log(updatedLog.fbWeightId);
      await axios.delete(`https://api.fitbit.com/1/user/-/body/log/weight/${updatedLog.fbWeightId}.json`, {
        headers: { Authorization: req.headers.authorization },
      });
      const { data } = await axios.post(`https://api.fitbit.com/1/user/-/body/log/weight.json?date=${date}&weight=${weight}`, {}, {
        headers: { Authorization: req.headers.authorization },
      });
      await db.weightLog.update({ fbWeightId: data.weightLog.logId }, {
        where: { id: updatedLog.id, clientId: req.user.id },
      });
    }
    return res.status(200).send({
      message: 'Weight log updated successfully',
      weightLog: {
        id: updatedLog.id,
        loggedAt: formatDate(updatedLog.loggedAt),
        createdAt: formatDate(updatedLog.createdAt),
        weight: updatedLog.weight,
        bodyFat: updatedLog.bodyFat,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message || 'Failed to edit weight log',
    });
  }
}

async function removeWeightLog(req, res) {
  try {
    const log = await db.weightLog.findOne({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });

    if (!log) throw new Error('Weight log does not exist');
    if (req.fitbit) {
      await axios.delete(`https://api.fitbit.com/1/user/-/body/log/weight/${log.fbWeightId}.json`, {
        headers: { Authorization: req.headers.authorization },
      });
    }
    if (req.fitbit && log.fbBodyFatId) {
      await axios.delete(`https://api.fitbit.com/1/user/-/body/log/fat/${log.fbBodyFatId}.json`, {
        headers: { Authorization: req.headers.authorization },
      });
    }
    await db.weightLog.destroy({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    return res.status(200).send({
      message: 'Weight log removed succesfully',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message || 'Failed to remove weight log' });
  }
}

export {
  getWeightLogs,
  createWeightLog,
  editWeightLog,
  removeWeightLog,
};
