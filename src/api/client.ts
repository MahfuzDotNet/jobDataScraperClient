// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default apiClient;

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
