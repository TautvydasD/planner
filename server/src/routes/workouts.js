import { Router } from 'express';
import {
  getWorkouts,
  createWorkout,
  editWorkout,
  removeWorkout,
} from '../controllers/workouts.js';

const app = Router();

app.route('/')
  .get(getWorkouts)
  .post(createWorkout);

app.route('/:id')
  .put(editWorkout)
  .delete(removeWorkout);

export { app as workouts };
