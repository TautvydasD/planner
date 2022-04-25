import axios from 'axios';
import getAuthenticationHeader from './auth';

class User {
  constructor() {
    this.API_URL = 'http://localhost:5000/api/v1';
  }

  // Statistics
  getStatistics() {
    return axios.get(`${this.API_URL}/statistics`, {
      headers: getAuthenticationHeader(),
    });
  }

  // Events
  getEvents() {
    return axios.get(`${this.API_URL}/events`, {
      headers: getAuthenticationHeader(),
    });
  }

  addEvent(event) {
    return axios.post(`${this.API_URL}/events`, event, {
      headers: getAuthenticationHeader(),
    });
  }

  editEvent(event, id) {
    return axios.put(`${this.API_URL}/events/${id}`, event, {
      headers: getAuthenticationHeader(),
    });
  }

  removeEvent(id) {
    return axios.delete(`${this.API_URL}/events/${id}`, {
      headers: getAuthenticationHeader(),
    });
  }

  // Profile
  getProfile() {
    return axios.get(`${this.API_URL}/users`, {
      headers: getAuthenticationHeader(),
    });
  }

  editProfile(userData) {
    return axios.put(`${this.API_URL}/users/${userData.id}`, userData, {
      headers: getAuthenticationHeader(),
    });
  }

  // Exercises
  getWgerExercises() {
    return axios.get(`${this.API_URL}/exercises/wGerExercises`, {
      headers: getAuthenticationHeader(),
    });
  }

  getExercises() {
    return axios.get(`${this.API_URL}/exercises`, {
      headers: getAuthenticationHeader(),
    });
  }

  createExercise(exercise) {
    return axios.post(`${this.API_URL}/exercises`, exercise, {
      headers: getAuthenticationHeader(),
    });
  }

  editExercise(id, exercise) {
    return axios.put(`${this.API_URL}/exercises/${id}`, exercise, {
      headers: getAuthenticationHeader(),
    });
  }

  removeExercise(id) {
    return axios.delete(`${this.API_URL}/exercises/${id}`, {
      headers: getAuthenticationHeader(),
    });
  }

  // Water logging
  getWaterLogs() {
    return axios.get(`${this.API_URL}/waterlogs`, {
      headers: getAuthenticationHeader(),
    });
  }

  createWaterLog(log) {
    return axios.post(`${this.API_URL}/waterlogs`, log, {
      headers: getAuthenticationHeader(),
    });
  }

  editWaterLog(id, log) {
    return axios.put(`${this.API_URL}/waterlogs/${id}`, log, {
      headers: getAuthenticationHeader(),
    });
  }

  removeWaterLog(id) {
    return axios.delete(`${this.API_URL}/waterlogs/${id}`, {
      headers: getAuthenticationHeader(),
    });
  }

  // Weight logging
  getWeightLogs() {
    return axios.get(`${this.API_URL}/weightlogs`, {
      headers: getAuthenticationHeader(),
    });
  }

  createWeightLog(log) {
    return axios.post(`${this.API_URL}/weightlogs`, log, {
      headers: getAuthenticationHeader(),
    });
  }

  editWeightLog(id, log) {
    return axios.put(`${this.API_URL}/weightlogs/${id}`, log, {
      headers: getAuthenticationHeader(),
    });
  }

  removeWeightLog(id) {
    return axios.delete(`${this.API_URL}/weightlogs/${id}`, {
      headers: getAuthenticationHeader(),
    });
  }

  getCoaches() {
    return axios.get(`${this.API_URL}/coaches`, {
      headers: getAuthenticationHeader(),
    });
  }

  getRooms() {
    return axios.get(`${this.API_URL}/rooms`, {
      headers: getAuthenticationHeader(),
    });
  }

  createRoom(roomObj) {
    return axios.post(`${this.API_URL}/rooms`, roomObj, {
      headers: getAuthenticationHeader(),
    });
  }

  createMessage(messageObj) {
    return axios.post(`${this.API_URL}/messages`, messageObj, {
      headers: getAuthenticationHeader(),
    });
  }

  // workouts
  getWorkouts() {
    return axios.get(`${this.API_URL}/workouts`, {
      headers: getAuthenticationHeader(),
    });
  }

  addWorkout(workout) {
    return axios.post(`${this.API_URL}/workouts`, workout, {
      headers: getAuthenticationHeader(),
    });
  }

  editWorkout(workout, id) {
    return axios.put(`${this.API_URL}/workouts/${id}`, workout, {
      headers: getAuthenticationHeader(),
    });
  }

  removeWorkout(id) {
    return axios.delete(`${this.API_URL}/workouts/${id}`, {
      headers: getAuthenticationHeader(),
    });
  }
}

export default new User();
