import axios from 'axios';
import { db } from '../db.js';

const wgerExercisesEndpoint = 'https://wger.de/api/v2/exerciseinfo/?limit=500&offset=0';

const wGerExercises = [];

async function getWgerExercises() {
  const { data } = await axios.get(wgerExercisesEndpoint);
  const { results } = data;
  wGerExercises.push(...results.filter((e) => e.language.id === 2));
}

async function getExercises(req, res) {
  try {
    const publicExercises = await db.exercise.findAll({
      attributes: { exclude: ['clientId'] },
      where: { access_public: 'true' },
      include: [{
        model: db.client,
        as: 'client',
        attributes: ['username'],
      }],
      raw: true,
      nest: true,
    });
    publicExercises.forEach((e) => {
      e.createdAt = `${e.createdAt.toLocaleDateString()}T${e.createdAt.toLocaleTimeString()}`;
      e.updatedAt = `${e.updatedAt.toLocaleDateString()}T${e.updatedAt.toLocaleTimeString()}`;
    });
    const data = {
      exercises: publicExercises,
    };
    if (req.user) {
      const exercises = await db.exercise.findAll({
        where: { clientId: req.user.id },
        include: [{
          model: db.client,
          as: 'client',
          attributes: ['username'],
        }],
        raw: true,
        nest: true,
      });
      data.myExercises = exercises;
    }
    return res.status(200).send(data);
    // return setTimeout(() => res.status(200).send(data), 10000);
  } catch (error) {
    return res.status(400).send({});
  }
}

function getParams(req) {
  return {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    muscles: req.body.muscles,
    muscles_secondary: req.body.muscles_secondary,
    access_public: req.body.access_public,
    imageUrl: req.body.imageUrl,
    equipment: req.body.equipment,
    videoUrl: req.body.videoUrl,
    clientId: req.user.id,
  };
}

async function createExercise(req, res) {
  try {
    if (!req.user) {
      return res.status(400).send({ message: 'User not found' });
    }
    const params = getParams(req);
    const newExercise = await db.exercise.create(params);

    return res.status(201).send({
      message: 'Exercise has been created',
      data: newExercise,
    });
  } catch (error) {
    return res.status(400).send({ message: 'Failed' });
  }
}

async function editExercise(req, res) {
  try {
    const params = getParams(req);
    await db.exercise.update(params, {
      where: { id: req.params.id },
    });
    const exercise = await db.exercise.findOne({
      where: { id: req.params.id },
    });
    return res.status(201).send({
      message: 'Exercise has been updated',
      data: exercise,
    });
  } catch (error) {
    return res.status(400).send({ message: 'Failed' });
  }
}

async function removeExercise(req, res) {
  try {
    if (!req.user) {
      return res.status(400).send({
        message: 'User not found',
      });
    }
    await db.exercise.destroy({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    return res.status(200).send({
      message: 'Exercise has been removed',
    });
  } catch (error) {
    return res.status(400).send({ message: 'Failed' });
  }
}

export {
  getWgerExercises,
  wGerExercises,
  getExercises,
  createExercise,
  editExercise,
  removeExercise,
};
