import { config } from 'yargs';
import apiAxios from './api';
import tokenizer from './token';

function handleRequestSuccess(store) {
  const token = tokenizer.getLocalAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return token;
}

function handleFailure(err) {
  return Promise.reject(err);
}

function createInterception(store) {
  apiAxios.interceptors.request.use(
    handleRequestSuccess,
    handleFailure,
  );
  apiAxios.interceptors.response.use(
    (res) => res,
    async (err) => {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_retry"] }] */
      const lastSetup = err.config;
      if (!(lastSetup.url !== '/' && err.response)) return Promise.reject(err);
      if (err.response.status === 401 && !lastSetup._retry) {
        lastSetup._retry = true;
        // try {
        //   const response = await
        // } catch (error) {
        // }
      }
      return Promise.reject(err);
    },
  );
}

export default createInterception;