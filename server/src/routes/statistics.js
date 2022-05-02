import { Router } from 'express';
import { getStatistics, getHeart } from '../controllers/statistics.js';

const app = Router();

app.get('/', getStatistics);

app.get('/heartRates/:date/:start/:end', getHeart);

export { app as statistics };
