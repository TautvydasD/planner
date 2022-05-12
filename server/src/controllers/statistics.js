/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/controllers/statistics
*
*/
import axios from 'axios';
import moment from 'moment';
import { db } from '../db.js';
import { formatDate } from '../helpers/index.js';

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

async function getHeart(req, res) {
  try {
    const dateRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/heart/date/${req.params.date}/1d.json`, {
      headers: { Authorization: req.headers.authorization },
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
