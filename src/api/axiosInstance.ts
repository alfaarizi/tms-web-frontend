import axios from 'axios';
import { env } from 'runtime-env';

// Set config defaults when creating the instance
export const axiosInstance = axios.create({
    baseURL: env.REACT_APP_API_BASEURL,
});
