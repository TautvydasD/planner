import { Router } from 'express';
import {
  getRooms,
  createRoom,
  editRoom,
  removeRoom,
} from '../controllers/rooms.js';

const app = Router();

app.route('/')
  .get(getRooms)
  .post(createRoom);

app.route('/:id')
  .put(editRoom)
  .delete(removeRoom);

export { app as rooms };
