/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/routes
*
*/
import { clients } from './routes/clients.js';
import { events } from './routes/events.js';
import { login } from './routes/api.js';
import { statistics } from './routes/statistics.js';
import { fitbit } from './routes/fitbit.js';
import { exercises } from './routes/exercises.js';
import { waterLogs } from './routes/waterLogs.js';
import { weightLogs } from './routes/weightLogs.js';
import { coaches } from './routes/coaches.js';
import { rooms } from './routes/rooms.js';
import { messages } from './routes/messages.js';
import { workouts } from './routes/workouts.js';

export {
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
};
