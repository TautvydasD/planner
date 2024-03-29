import axios from 'axios';

class Authentication {
  constructor() {
    this.API_ENDPOINT = 'http://localhost:5000/api/v1';
  }

  async login(user) {
    try {
      const { data } = await axios.post(this.API_ENDPOINT, user);
      if (!data.access_token) throw new Error('');
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      return null;
    }
  }

  async fitbitLogin({ code }) {
    try {
      console.log(code);
      console.log('here goes');
      const { data } = await axios.post(`${this.API_ENDPOINT}/fitbit`, {
        code,
      });
      if (!data.access_token) throw new Error('');
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (_) {
      return null;
    }
  }

  async signup(user) {
    try {
      const { data } = await axios.post(`${this.API_ENDPOINT}/signup`, user);
      if (!data.access_token) throw new Error('');
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      return null;
    }
  }
}

export default new Authentication();
