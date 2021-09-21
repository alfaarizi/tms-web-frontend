import axios from 'axios';

// Set config defaults when creating the instance
export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL,
});
