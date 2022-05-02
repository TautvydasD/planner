import axios from 'axios';
import moment from 'moment';
import { db } from '../db.js';
import { formatDate } from './helper.js';

function getTimelyOccurences(objArr, ofString, fString, previousWeek) {
  const today = previousWeek
    ? previousWeek()
    : moment();
  const start = today.startOf(ofString).format('YYYY-MM-DD');
  const end = today.endOf(ofString).format('YYYY-MM-DD');
  const occurences = {};
  const add = ofString === 'year' ? 'months' : 'days';
  for (let m = moment(start); m.isSameOrBefore(end); m.add(1, add)) {
    occurences[m.format(fString)] = 0;
  }
  const filteredArr = objArr.filter((o) => moment(o.createdAt).isBetween(start, end));
  filteredArr.forEach((f) => {
    const dateFormat = moment(f.createdAt).format(fString);
    occurences[dateFormat] += 1;
  });
  return Object.entries(occurences);
}

function getTodayInstances(objArr) {
  const today = moment().format('YYYY-MM-DD');
  return objArr.filter((o) => moment(o.createdAt).format('YYYY-MM-DD') === today);
}

async function getTableStatics(user, tableName) {
  const data = await db[tableName].findAll({ where: { clientId: user.id } });
  return {
    overall: data.length,
    monthly: getTimelyOccurences(data, 'year', 'MMM'),
    currentWeek: getTimelyOccurences(data, 'isoWeek', 'ddd'),
    previousWeek: getTimelyOccurences(data, 'isoWeek', 'ddd', () => moment().subtract(7, 'days')),
    today: getTodayInstances(data).length,
  };
}

function sortBy(a, b) {
  if (a.loggedAt > b.loggedAt) {
    return -1;
  }
  if (a.loggedAt < b.loggedAt) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

function getBmiStatus(bmi) {
  const bmiNumber = parseInt(bmi, 10);
  if (bmiNumber >= 30) {
    return 'obesity';
  }
  if (bmiNumber >= 25 && bmiNumber < 30) {
    return 'overweight';
  }
  if (bmiNumber >= 18.5 && bmiNumber < 25) {
    return 'healthy';
  }
  return 'underweight';
}

async function getBmiData(user) {
  if (!user.height) return { code: 1, error: 'Missing user height' };
  const weightsLogs = await db.weightLog.findAll({ where: { clientId: user.id } });
  if (weightsLogs.length === 0) return { code: 2, error: 'Missing user weight logs' };
  const weights = weightsLogs.map((w) => ({
    id: w.id,
    weight: w.weight,
    loggedAt: formatDate(w.loggedAt),
  }));
  const latestWeight = parseInt(weights.sort(sortBy)[0].weight, 10);
  const height = parseInt(user.height, 10) / 100;
  const bmi = (latestWeight / height ** 2).toFixed(2);
  return {
    bmi,
    status: getBmiStatus(bmi),
  };
}

async function getStatistics(req, res) {
  try {
    const data = {};

    if (req.fitbit) {
      const sleepRes = await axios.get('https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=2022-03-25&sort=desc&offset=0&limit=100', {
        headers: { Authorization: req.headers.authorization },
      });
      const devicesRes = await axios.get('https://api.fitbit.com/1/user/-/devices.json', {
        headers: { Authorization: req.headers.authorization },
      });
      // const activitiesRes = await axios.get('https://api.fitbit.com/1/user/-/activities.json', { headers: req.headers });
      const friendsRes = await axios.get('https://api.fitbit.com/1.1/user/-/friends.json', {
        headers: { Authorization: req.headers.authorization },
      });
      data.sleep = sleepRes.data.sleep;
      data.devices = devicesRes.data;
      // data.activities = activitiesRes.data;
      data.friends = friendsRes.data.data;
    }

    data.events = await getTableStatics(req.user, 'event');
    data.exercises = await getTableStatics(req.user, 'exercise');
    data.waterLogs = await getTableStatics(req.user, 'waterLog');
    data.weightLogs = await getTableStatics(req.user, 'weightLog');
    data.workouts = await getTableStatics(req.user, 'workout');
    data.bmi = await getBmiData(req.user);

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      errors: error,
    });
  }
}
// {
//   "access_token":"eyJh
// bGciOiJIUzI1NiJ9.eyJhdWQiOiIy
// MzhHOVoiLCJzdWIiOiI3VDc4N1kiLCJpc3MiOiJGaXRiaXQiLCJ
// 0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251d
// CB3cHJvIHdzbGUgd3dlaSB3c29jIHdhY3Qgd3NldCB3bG9jI
// wiZXhwIjoxNjUxNDY3MTY1LCJpYXQiOjE2NTE0MzgzNjV9.N
// sMNDsrstavc8op9v7rTOERrYzdKabzNWvx5bQJsHaw",
//   "expires_in":28800,
//   "refresh_token":"3256734c1452eca9d1284edd1e340c63dfb1939fc9c20149724ec367fae6dbbf",
//   "scope":"activity settings location nutrition social profile sleep weight heartrate",
//   "token_type":"Bearer",
//   "user_id":"7T787Y"
// }

// curl -i -X POST \
// https://api.fitbit.com/oauth2/token \
//  -H "Authorization: Basic MjM4RzlaOmM3NGEwYjVlYjIxZTk2NTU1MmIxYTNjNDExZDljNjBj"  \
//  -H "Content-Type: application/x-www-form-urlencoded"  \
//  --data "grant_type=refresh_token"  \
//  --data "refresh_token=db6b36929d9ba9a1801e643788371676ae079539f0c87c77bbf5a8aea7963c4c"
async function getHeart(req, res) {
  try {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: 'df7720fe29c469c7e2b55b003cde2b57d55173fc4cb3eb1bdc88d4409b66c886',
    });
    const { data } = await axios.post('https://api.fitbit.com/oauth2/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic MjM4RzlaOmM3NGEwYjVlYjIxZTk2NTU1MmIxYTNjNDExZDljNjBj',
      },
    });
    const dateRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/heart/date/${req.params.date}/1d.json`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    const filterVals = dateRes.data['activities-heart-intraday'].dataset.filter((f) => f.time >= req.params.start && f.time <= req.params.end);
    res.status(200).send({
      heartRates: filterVals,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message,
    });
  }
}

export { getStatistics, getHeart };
