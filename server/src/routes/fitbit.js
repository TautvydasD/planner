/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/routes/fitbit
*
*/
import { Router } from 'express';
import axios from 'axios';

const app = Router();

app.route('/users/:id')
  .get(async (req, res) => {
    const Authorization = req.headers.authorization;
    const headers = {
      Authorization,
    };

    try {
      const { data } = await axios.get(`https://api.fitbit.com/1/user/${req.params.id}/profile.json`, { headers });
      console.log(data);
      return res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(400).send({
        errors: error.response.data.errors,
      });
    }
  });

export { app as fitbit };
