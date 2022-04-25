import { Router } from 'express';
import {
  getWaterLogs,
  createWaterLog,
  editWaterLog,
  removeWaterLog,
} from '../controllers/waterLogs.js';

const app = Router();

app.route('/')
  .get(getWaterLogs)
  .post(createWaterLog);

app.route('/:id')
  .put(editWaterLog)
  .delete(removeWaterLog);

export { app as waterLogs };
