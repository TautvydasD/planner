import { Router } from 'express';
// import axios from 'axios';

const app = Router();

// function getJwtBody(jwtToken) {
//   const encodedPayload = jwtToken.split('.')[1];
//   return JSON.parse(atob(encodedPayload));
// }

app.get('/', async (req, res) => {
  // const Authorization = req.headers.authorization;
  // const headers = {
  //   Authorization,
  // };
  // TODO: add language support
  try {
    // const exerciseRes = await axios.get('https://wger.de/api/v2/exerciseinfo/?language=2');
    // console.log();
    // const sleepRes = await axios.get('https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=2022-03-25&sort=desc&offset=0&limit=100', { headers });
    // const devicesRes = await axios.get('https://api.fitbit.com/1/user/-/devices.json', { headers });
    // const activitiesRes = await axios.get('https://api.fitbit.com/1/user/-/activities.json', { headers });
    // const friendsRes = await axios.get(' https://api.fitbit.com/1.1/user/-/friends.json', { headers });
    return res.status(200).send({
      success: true,
      data: [
        // { sleep: sleepRes.data.sleep },
        // { devices: devicesRes.data },
        // { activities: activitiesRes.data },
        // { friends: friendsRes.data.data },
      ],
    });
  } catch (error) {
    return res.status(400).send({
      errors: error,
    });
  }
});

export { app as wger };
