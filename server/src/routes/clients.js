import { Router } from 'express';
import { editUser } from '../controllers/clients.js';

const app = Router();

app.route('/')
  .get((req, res) => {
    res.status(200).send({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      description: req.user.description,
      water: req.user.water,
      calories: req.user.calories,
      hasFitbit: req.user.hasFitbit,
      useFitbit: req.user.useFitbit,
      verified: req.user.verified,
      coach: req.user.coach,
      height: req.user.height,
    });
  });

app.route('/:id')
  .put(editUser);

export { app as clients };
