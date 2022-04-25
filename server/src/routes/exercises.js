import { Router } from 'express';
import {
  wGerExercises,
  getExercises,
  createExercise,
  editExercise,
  removeExercise,
} from '../controllers/exercises.js';

const app = Router();

app.route('/')
  .get(getExercises)
  .post(createExercise);

app.route('/:id')
  .put(editExercise)
  .delete(removeExercise);

app.route('/wgerExercises')
  .get((req, res) => res.status(200).send({ wGerExercises }));

export { app as exercises };
