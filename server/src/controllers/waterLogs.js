import axios from 'axios';
import { db } from '../db.js';
import { formatDate } from './helper.js';

async function getWaterLogs(req, res) {
  try {
    const logs = await db.waterLog.findAll({
      where: { clientId: req.user.id },
    });
    const mappedLogs = logs.map((l) => ({
      id: l.id,
      amount: l.amount,
      loggedAt: formatDate(l.loggedAt),
      createdAt: formatDate(l.createdAt),
    }));
    return res.status(200).send({
      waterLogs: mappedLogs,
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed to get water logs',
    });
  }
}

function getParamsForFitbit(body) {
  return {
    amount: body.amount,
    date: formatDate(body.loggedAt).split(' ')[0],
    unit: 'ml',
  };
}

async function createWaterLog(req, res) {
  try {
    const log = await db.waterLog.create({
      clientId: req.user.id,
      ...req.body,
    });
    if (req.fitbit) {
      const { date, unit, amount } = getParamsForFitbit(log);
      const { data } = await axios.post(`https://api.fitbit.com/1/user/-/foods/log/water.json?date=${date}&amount=${amount}&unit=${unit}`, {}, {
        headers: { Authorization: req.headers.authorization },
      });
      await db.waterLog.update({
        fitbitId: data.waterLog.logId,
      }, {
        where: {
          id: log.id,
          clientId: req.user.id,
        },
      });
    }
    return res.status(201).send({
      message: 'Water log created succcessfully',
      waterLog: {
        id: log.id,
        amount: log.amount,
        loggedAt: formatDate(log.loggedAt),
        createdAt: formatDate(log.createdAt),
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create water log',
    });
  }
}

async function editWaterLog(req, res) {
  try {
    const log = db.waterLog.findOne({
      where: { id: req.params.id },
    });
    if (!log) throw new Error('Water log does not exist');
    await db.waterLog.update(req.body, {
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    const updatedLog = await db.waterLog.findOne({
      where: { id: req.params.id },
    });
    if (req.fitbit) {
      const { date, unit, amount } = getParamsForFitbit(updatedLog);
      await axios.post(`https://api.fitbit.com/1/user/-/foods/log/water/${updatedLog.fitbitId}.json?date=${date}&amount=${amount}&unit=${unit}`, {}, {
        headers: { Authorization: req.headers.authorization },
      });
    }
    return res.status(200).send({
      message: 'Water log updated successfully',
      waterLog: {
        id: updatedLog.id,
        loggedAt: formatDate(updatedLog.loggedAt),
        createdAt: formatDate(updatedLog.createdAt),
        amount: updatedLog.amount,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message || 'Failed to edit water log',
    });
  }
}

async function removeWaterLog(req, res) {
  try {
    const log = await db.waterLog.findOne({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });

    if (!log) throw new Error('Water log does not exist');
    if (req.fitbit) {
      await axios.delete(`https://api.fitbit.com/1/user/-/foods/log/water/${log.fitbitId}.json`, {
        headers: { Authorization: req.headers.authorization },
      });
    }
    await db.waterLog.destroy({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    return res.status(200).send({
      message: 'Water log removed succesfully',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message || 'Failed to remove water log' });
  }
}

export {
  getWaterLogs,
  createWaterLog,
  editWaterLog,
  removeWaterLog,
};
