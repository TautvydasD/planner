/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/clients
*
*/
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

function getDefaultResponse(req, res) {
  res.status(200).send({ message: 'Hello World!' });
}

async function createUser(req, res) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).send({
      message: 'Missing parameters',
    });
  }
  try {
    const user = await db.client.findOne({
      where: { email },
    });
    if (user) {
      return res.status(400).send({
        message: 'User already exists',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const verificationHash = await bcrypt.hash(`${email}${req.body.username}`, salt);
    const newUser = db.client.build({
      ...req.body,
      password: hashedPass,
      verificationHash,
    });
    await newUser.save();
    const token = jwt.sign({
      sub: newUser.email,
      expiresIn: '1h',
    }, process.env.SECRET, { algorithm: 'HS256' });
    return res.status(201).send({
      email,
      access_token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: 'Failed',
    });
  }
}

function getParams(body) {
  return {
    email: body.email,
    water: body.water,
    calories: body.calories,
    description: body.description,
    useFitbit: body.useFitbit,
    height: body.height,
  };
}

async function editUser(req, res) {
  try {
    const params = getParams(req.body);
    Object.keys(params).forEach((param) => {
      if (!params[param]) return;
      req.user[param] = params[param];
    });
    await req.user.save();
    return res.status(200).send({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      description: req.user.description,
      water: req.user.water,
      calories: req.user.calories,
      hasFitbit: req.user.hasFitbit,
      verified: req.user.verified,
      coach: req.user.coach,
      useFitbit: req.user.useFitbit,
      height: req.user.height,
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed',
    });
  }
}

export {
  getDefaultResponse,
  createUser,
  editUser,
};
