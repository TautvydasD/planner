import { Router } from 'express';
import {
  getWeightLogs,
  createWeightLog,
  editWeightLog,
  removeWeightLog,
} from '../controllers/weightLogs.js';

const app = Router();

app.route('/')
  .get(getWeightLogs)
  .post(createWeightLog);

app.route('/:id')
  .put(editWeightLog)
  .delete(removeWeightLog);

export { app as weightLogs };
