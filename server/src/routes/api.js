/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/routes/api
*
*/
import { Router } from 'express';
import {
  login,
  refreshToken,
  fitbitLogin,
  verifyUser,
} from '../controllers/api.js';
import { createUser } from '../controllers/clients.js';

const app = Router();

app.post('/', login);
app.post('/refresh', refreshToken);
app.post('/signup', createUser);
app.post('/fitbit', fitbitLogin);
app.get('/verify/:id', verifyUser);

export { app as login };
