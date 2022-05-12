/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/app
*
*/
import axios from 'axios';
import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
  clients,
  events,
  login,
  statistics,
  fitbit,
  exercises,
  waterLogs,
  weightLogs,
  coaches,
  rooms,
  messages,
  workouts,
} from './routes.js';
import { db } from './db.js';

config();

function getNotFound(req, res) {
  return res.status(404).send({ message: 'Route not found' });
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors());
function getPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

async function verifyToken(req, res, next) {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw new Error('Missing credentials');
    const { sub, iss } = getPayload(authorization.split(' ')[1]);
    let condition = { email: sub };
    if (iss === 'Fitbit') {
      const { data } = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
        headers: { Authorization: authorization },
      });
      condition = { username: data.user.fullName };
      req.fitbit = true;
    }
    req.user = await db.client.findOne({ where: condition });
    return next();
  } catch (error) {
    return res.status(401).send({
      error: error.message || 'Failed to get user',
    });
  }
}

app.use('/api/v1', login);
app.use('/api/v1/users', [verifyToken, clients]);
app.use('/api/v1/events', [verifyToken, events]);
app.use('/api/v1/statistics', [verifyToken, statistics]);
app.use('/api/v1/fitbit', [verifyToken, fitbit]);
app.use('/api/v1/exercises', [verifyToken, exercises]);
app.use('/api/v1/waterlogs', [verifyToken, waterLogs]);
app.use('/api/v1/weightlogs', [verifyToken, weightLogs]);
app.use('/api/v1/coaches', [verifyToken, coaches]);
app.use('/api/v1/rooms', [verifyToken, rooms]);
app.use('/api/v1/messages', [verifyToken, messages]);
app.use('/api/v1/workouts', [verifyToken, workouts]);

app.use(getNotFound);

export { app };
