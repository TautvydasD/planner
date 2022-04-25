import { Router } from 'express';
import { db } from '../db.js';

const app = Router();

app.route('/')
  .get(async (req, res) => {
    try {
      const coaches = await db.client.findAll({
        attributes: ['email', 'description', 'username', 'id', 'coach'],
        where: {
          coach: true || 'true',
        },
      });
      res.status(200).send({
        coaches,
      });
    } catch (error) {
      res.status(400).send({
        message: 'Failed to get coaches',
      });
    }
  });

export { app as coaches };
