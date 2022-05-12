const axios = {};

axios.get = () => new Promise((resolve) => resolve({
  success: true,
  data: [],
}));

axios.post = () => new Promise((resolve) => resolve({
  success: true,
  data: {},
}));

axios.put = () => new Promise((resolve) => resolve({
  success: true,
  data: {},
}));

axios.delete = () => new Promise((resolve) => resolve({
  success: true,
}));

module.exports = axios;
