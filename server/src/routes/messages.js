/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/routes/messages
*
*/
import { Router } from 'express';
import {
  createMessage,
} from '../controllers/messages.js';

const app = Router();

app.route('/')
  .post(createMessage);

export { app as messages };
