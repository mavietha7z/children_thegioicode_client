import axios from 'axios';

const baseURL = 'http://localhost:8080/api';

export const urlUpload = `${baseURL}/images/upload`;

const request = axios.create({
    baseURL,
    withCredentials: true,
});

export default request;
