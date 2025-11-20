// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default apiClient;

// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL;

// const apiClient = axios.create({
//   baseURL: `${API_BASE}/api`,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default apiClient;



import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

// If VITE_API_URL is empty, fallback to proxy route "/api"
const baseURL = API_BASE ? `${API_BASE}/api` : "/api";

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // ✅ necessary for cookies/session
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
