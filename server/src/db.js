import Sequelize from 'sequelize';
import { config } from 'dotenv';
// import bcrypt from 'bcrypt';

import {
  clientModel,
  eventModel,
  exerciseModel,
  waterLogModel,
  weightLogModel,
  roomModel,
  messageModel,
  workoutModel,
  workoutExerciseModel,
} from './models/index.js';

config();

const {
  DIALECT,
  DB,
  USER,
  PASSWORD,
  DB_PORT,
  DB_IP,
} = process.env;

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: DB_IP,
  dialect: DIALECT,
  port: DB_PORT,
  logging: false,
});

async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const client = clientModel(sequelize, Sequelize.DataTypes);
const event = eventModel(sequelize, Sequelize.DataTypes);
const exercise = exerciseModel(sequelize, Sequelize.DataTypes);
const waterLog = waterLogModel(sequelize, Sequelize.DataTypes);
const weightLog = weightLogModel(sequelize, Sequelize.DataTypes);
const room = roomModel(sequelize, Sequelize.DataTypes);
const message = messageModel(sequelize, Sequelize.DataTypes);
const workout = workoutModel(sequelize, Sequelize.DataTypes);
const workoutExercise = workoutExerciseModel(sequelize, Sequelize.DataTypes);

// async function creator(params) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(params.password, salt);
//     const newUser = client.build({
//       ...params,
//       password: hashedPass,
//     });
//     await newUser.save();
//   } catch (error) {
//     console.log(error);
//   }
// }

async function createData() {
  try {
    // client
    // await client.create({
    //   username: 'tautvisss',
    //   email: 'taut@gmail.com',
    //   password: 'test',
    // });
    // await client.create({
    //   username: 'lol',
    //   email: 'lol@gmail.com',
    //   password: 'test',
    // });
    // await client.create({
    //   username: 'hah',
    //   email: 'hah@gmail.com',
    //   password: 'test',
    // });
    // await client.create({
    //   username: 'tai',
    //   email: 'yes@gmail.com',
    //   password: '$2b$10$f3ybdrw6ANDV7X/EKm0U5uKqaYmMb6u7KQz.UkW7Eg1aJZs2vvPDq',
    // });
    // await creator({
    //   username: 'taip',
    //   email: 'tautvis62@gmail.com',
    //   password: 'tester',
    //   verificationHash: 'tautvis',
    //   height: '188',
    // });
    // await creator({
    //   username: 'tester1',
    //   email: 'tester1@gmail.com',
    //   password: 'tester',
    //   coach: true,
    // });
    // await creator({
    //   username: 'tester2',
    //   email: 'tester2@gmail.com',
    //   password: 'tester',
    //   coach: true,
    // });
    // await creator({
    //   username: 'tester3',
    //   email: 'tester3@gmail.com',
    //   password: 'tester',
    //   coach: true,
    // });
    // // event
    // await event.create({
    //   name: 'job1',
    //   type: 'job',
    //   startTime: '2022-03-27T20:00:00',
    //   endTime: '2022-03-27T21:00:00',
    //   createdAt: '2022-03-27T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity1',
    //   type: 'activity',
    //   startTime: '2022-03-27T10:00:00',
    //   endTime: '2022-03-27T12:00:00',
    //   createdAt: '2022-03-27T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity2',
    //   type: 'activity',
    //   startTime: '2022-03-26T10:00:00',
    //   endTime: '2022-03-26T16:00:00',
    //   createdAt: '2022-03-27T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity3',
    //   type: 'activity',
    //   startTime: '2022-03-26T10:00:00',
    //   endTime: '2022-03-26T16:00:00',
    //   createdAt: '2022-03-28T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity4',
    //   type: 'activity',
    //   startTime: '2022-03-26T10:00:00',
    //   endTime: '2022-03-26T16:00:00',
    //   createdAt: '2022-03-29T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'job2',
    //   type: 'job',
    //   startTime: '2022-04-10T20:00:00',
    //   endTime: '2022-04-10T21:00:00',
    //   createdAt: '2022-04-10T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'job3',
    //   type: 'job',
    //   startTime: '2022-04-10T20:00:00',
    //   endTime: '2022-04-10T21:00:00',
    //   createdAt: '2022-04-11T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'job4',
    //   type: 'job',
    //   startTime: '2022-04-10T20:00:00',
    //   endTime: '2022-04-10T21:00:00',
    //   createdAt: '2022-04-05T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity5',
    //   type: 'activity',
    //   startTime: '2022-04-10T10:00:00',
    //   endTime: '2022-04-10T12:00:00',
    //   createdAt: '2022-04-10T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity6',
    //   type: 'activity',
    //   startTime: '2022-04-10T10:00:00',
    //   endTime: '2022-04-10T16:00:00',
    //   createdAt: '2022-04-10T20:00:00',
    //   clientId: '5',
    // });
    // await event.create({
    //   name: 'activity7',
    //   type: 'activity',
    //   startTime: '2022-04-11T10:00:00',
    //   endTime: '2022-04-12T16:00:00',
    //   createdAt: '2022-04-11T20:00:00',
    //   clientId: '5',
    // });
    // // waterLogs
    // await waterLog.create({
    //   amount: '200',
    //   loggedAt: '2022-03-27T10:00:00',
    //   clientId: '5',
    // });
    // await waterLog.create({
    //   amount: '400',
    //   loggedAt: '2022-03-26T10:00:00',
    //   clientId: '5',
    // });
    // await waterLog.create({
    //   amount: '200',
    //   loggedAt: '2022-03-27T10:00:00',
    //   clientId: '5',
    // });
    // await waterLog.create({
    //   amount: '400',
    //   loggedAt: '2022-03-26T19:00:00',
    //   clientId: '5',
    // });
    // // weightLogs
    // await weightLog.create({
    //   weight: '100',
    //   bodyFat: '23',
    //   loggedAt: '2022-03-27T20:00:00',
    //   clientId: '5',
    // });
    // await weightLog.create({
    //   weight: '100',
    //   bodyFat: '23',
    //   loggedAt: '2022-03-26T12:00:00',
    //   clientId: '5',
    // });
    // await weightLog.create({
    //   weight: '100',
    //   bodyFat: '23',
    //   loggedAt: '2022-03-27T11:00:00',
    //   clientId: '5',
    // });
    // await weightLog.create({
    //   weight: '100',
    //   bodyFat: '23',
    //   loggedAt: '2022-03-26T15:00:00',
    //   clientId: '5',
    // });
    // // exercise
    // await exercise.create({
    //   name: 'bench press',
    //   clientId: '5',
    // });
    // await exercise.create({
    //   name: 'bar bell press',
    //   clientId: '5',
    // });
    // await exercise.create({
    //   name: 'crunches',
    //   clientId: '5',
    // });
    // await exercise.create({
    //   name: 'sit ups',
    //   clientId: '5',
    // });
    // await exercise.create({
    //   name: 'crunches',
    //   clientId: '5',
    //   access_public: true,
    // });
    // await exercise.create({
    //   name: 'sit ups',
    //   clientId: '5',
    //   access_public: true,
    // });

    // await room.create({
    //   clientId: '5',
    //   toClientId: '6',
    // });
    // await room.create({
    //   clientId: '5',
    //   toClientId: '7',
    // });
    // await room.create({
    //   clientId: '8',
    //   toClientId: '5',
    // });

    // await message.create({
    //   clientId: 5,
    //   content: 'hello',
    //   roomId: '1',
    // });
    // await message.create({
    //   clientId: 6,
    //   content: 'Hello there',
    //   roomId: '1',
    // });

    // await message.create({
    //   clientId: 5,
    //   content: 'hello',
    //   roomId: '2',
    // });
    // await message.create({
    //   clientId: 5,
    //   content: 'Hello there',
    //   roomId: '2',
    // });

    // await message.create({
    //   clientId: 8,
    //   content: 'hello',
    //   roomId: '2',
    // });
    // await message.create({
    //   clientId: 8,
    //   content: 'Hello there',
    //   roomId: '2',
    // });

    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workout.create({
    //   name: 'nicer',
    //   description: 'asdasdas',
    //   clientId: '5',
    // });
    // await workoutExercise.create({
    //   workoutId: '1',
    //   exerciseId: '5',
    //   position: 1,
    // });
    // await workoutExercise.create({
    //   workoutId: '1',
    //   exerciseId: '5',
    //   position: 0,
    // });
  } catch (error) {
    console.log(error);
    console.log('Failed to create data');
  }
}

// Event relations
client.hasMany(event, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'events',
});
event.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});

// Exercise relations
client.hasMany(exercise, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'exercises',
});
exercise.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});
// water log relations
client.hasMany(waterLog, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'waterLogs',
});
waterLog.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});
// weight log relations
client.hasMany(weightLog, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'weightLogs',
});
weightLog.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});

// room - message relations
room.hasMany(message, {
  foreignKey: {
    name: 'roomId',
    allowNull: false,
  },
  as: 'messages',
});
message.belongsTo(room, {
  foreignKey: {
    name: 'roomId',
    allowNull: false,
  },
  as: 'room',
});
client.hasMany(room, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'rooms',
});
room.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});

client.hasMany(workout, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'workouts',
});
workout.belongsTo(client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false,
  },
  as: 'client',
});

event.belongsTo(workout, {
  foreignKey: {
    name: 'workoutId',
    allowNull: true,
  },
});

const db = {
  Sequelize,
  sequelize,
  authenticateDatabase,
  client,
  event,
  exercise,
  waterLog,
  weightLog,
  room,
  message,
  workout,
  workoutExercise,
  createData,
};

export { db };
