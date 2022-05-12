/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/api
*
*/
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { db } from '../db.js';

async function login(req, res) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).send({
      message: 'Invalid credentials',
    });
  }
  try {
    const user = await db.client.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid credentials',
      });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) {
      const token = jwt.sign({
        sub: user.email,
        expiresIn: '1h',
      }, process.env.SECRET, { algorithm: 'HS256' });
      return res.status(200).send({
        email,
        access_token: token,
      });
    }
    return res.status(400).send({
      message: 'Invalid credentials',
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Failed',
    });
  }
}

function refreshToken(req, res) {
  res.send(200).send({
    test: 'ok',
  });
}

async function fitbitLogin(req, res) {
  if (!req.body.code) {
    return res.status(404).send({
      message: 'Route not found',
    });
  }
  const headers = {
    Authorization: 'Basic MjM4NUdYOjNmZGViMTY1Nzg3YjMyYzQ1M2FlOTY1ZjM0ZTk3OTc1',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const clientId = '2385GX';
  const { code } = req.body;
  const body = new URLSearchParams({
    clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:8080',
  });
  try {
    const { data } = await axios.post('https://api.fitbit.com/oauth2/token', body, { headers });
    console.log(data);
    const userProfile = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    await db.client.findOrCreate({
      where: { username: userProfile.data.user.fullName },
      defaults: {
        email: `${userProfile.data.user.fullName}@gmail.com`,
        username: userProfile.data.user.fullName,
        password: 'fitbit',
        refresh_token: data.refresh_token,
      },
    });
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      errors: error.message,
    });
  }
}

async function verifyUser(req, res) {
  try {
    const user = await db.client.findOne({
      where: { verificationHash: req.params.id },
    });
    if (!user) throw new Error('Failed');
    user.verified = 0;
    user.verificationHash = null;
    await user.save();
    return res.status(200).redirect(301, 'http://localhost:8080');
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to verify user',
    });
  }
}

export {
  login,
  refreshToken,
  fitbitLogin,
  verifyUser,
};
