import { Router } from 'express';
import { getStatistics } from '../controllers/statistics.js';

const app = Router();

app.get('/', getStatistics);

export { app as statistics };
