// import apiClient from './client';

// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// export interface User {
//   username: string;
// }

// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     const response = await apiClient.post('/login', credentials);
//     return response.data;
//   },

//   logout: async () => {
//     const response = await apiClient.post('/logout');
//     return response.data;
//   },

//   getCurrentUser: async () => {
//     const response = await apiClient.get('/me');
//     return response.data;
//   },
// };



import apiClient from './client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },
};
