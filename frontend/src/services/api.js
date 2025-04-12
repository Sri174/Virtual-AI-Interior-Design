import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // change this to your backend URL
});

export const login = (data) => API.post('/auth/login/', data);
export const register = (data) => API.post('/auth/registration/', data);
export const getUserDesigns = (token) =>
  API.get('/designs/', {
    headers: { Authorization: `Token ${token}` }
  });
