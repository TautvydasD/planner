/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/routes/events
*
*/
import { Router } from 'express';
import {
  getEvents,
  createEvent,
  editEvents,
  removeEvents,
} from '../controllers/events.js';

const app = Router();

app.route('/')
  .get(getEvents)
  .post(createEvent);

app.route('/:id')
  .put(editEvents)
  .delete(removeEvents);

export { app as events };
