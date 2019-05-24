import axios from 'axios';

const baseURL = process.env === 'production' ? 'todo' : 'http://localhost:3000/REST/clientSite';

const mainAxios = axios.create({
  baseURL,
});
mainAxios.defaults.withCredentials = true;
export default mainAxios;
