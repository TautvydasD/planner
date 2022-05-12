/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/workouts
*
*/
import { db } from '../db.js';
import { formatDate } from '../helpers/index.js';

function getWorkoutColumns(instance) {
  return {
    id: instance.id,
    sets: instance.sets,
    name: instance.name,
    description: instance.description,
    exercises: instance.exercises,
    access_public: instance.access_public,
    image_url: instance.image_url,
    createdAt: formatDate(instance.createdAt),
  };
}

async function getFullWorkouts(field, fieldValue) {
  try {
    const workouts = await db.workout.findAll({
      where: { [field]: fieldValue },
    });

    const newWorkouts = await Promise.all(workouts.map(async (w) => {
      const workoutExercises = await db.workoutExercise.findAll({
        where: { workoutId: w.id },
      });
      const newWorkout = w;
      newWorkout.exercises = workoutExercises;
      return newWorkout;
    }));
    return newWorkouts;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

async function getWorkouts(req, res) {
  try {
    const myWorkouts = await getFullWorkouts('clientId', req.user.id);
    const allPublicWorkouts = await getFullWorkouts('access_public', true);
    const myMappedWorkouts = myWorkouts.map(getWorkoutColumns);
    const mappedWorkouts = allPublicWorkouts.map(getWorkoutColumns);
    return res.status(200).send({
      myWorkouts: myMappedWorkouts,
      workouts: mappedWorkouts,
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed to get workouts',
    });
  }
}

async function createWorkout(req, res) {
  try {
    const newWorkout = await db.workout.create({
      clientId: req.user.id,
      ...req.body,
    });
    const exercisePromises = req.body.exercises.map((e) => db.exercise.findByPk(e.id));
    const exercises = await Promise.all(exercisePromises);
    const workoutExercisesPromises = exercises.map((e, index) => db.workoutExercise.create({
      reps: req.body.exercises[index].reps,
      position: index,
      workoutId: newWorkout.id,
      exerciseId: e.id,
    }));
    const workoutExercises = await Promise.all(workoutExercisesPromises);
    return res.status(201).send({
      message: 'Workout created succcessfully',
      workout: {
        id: newWorkout.id,
        name: newWorkout.name,
        sets: newWorkout.sets,
        description: newWorkout.description,
        exercises: workoutExercises,
        access_public: newWorkout.access_public,
        image_url: newWorkout.image_url,
        createdAt: formatDate(newWorkout.createdAt),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: 'Failed to create workouts',
    });
  }
}

async function editWorkout(req, res) {
  try {
    const existantWorkout = await db.workout.findByPk(req.params.id);
    if (!existantWorkout) throw new Error('Workout does not exist');
    await db.workout.update(req.body, {
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    const workout = await db.workout.findOne({
      where: { id: req.params.id },
    });
    await db.workoutExercise.destroy({
      where: {
        workoutId: req.params.id,
      },
    });
    const workExerPromises = req.body.exercises.map((e) => db.workoutExercise.create({
      reps: e.reps,
      position: e.position,
      workoutId: workout.id,
      exerciseId: e.id,
      type: e.type,
    }));
    const workoutExercises = await Promise.all(workExerPromises);
    return res.status(200).send({
      message: 'Workout updated successfully',
      workout: {
        id: workout.id,
        sets: workout.sets,
        name: workout.name,
        description: workout.description,
        exercises: workoutExercises,
        access_public: workout.access_public,
        image_url: workout.image_url,
        createdAt: formatDate(workout.createdAt),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: error.message || 'Failed to edit workouts',
    });
  }
}

async function removeWorkout(req, res) {
  try {
    const workout = await db.workout.findOne({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });

    if (!workout) throw new Error('Workout does not exist');

    await db.workout.destroy({
      where: {
        clientId: req.user.id,
        id: req.params.id,
      },
    });
    await db.workoutExercise.destroy({
      where: {
        workoutId: workout.id,
      },
    });
    return res.status(200).send({
      message: 'Workout removed succesfully',
    });
  } catch (error) {
    return res.status(400).send({ message: error.message || 'Failed to remove workouts' });
  }
}

export {
  getWorkouts,
  createWorkout,
  editWorkout,
  removeWorkout,
};
