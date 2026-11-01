import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('empyrict_token', response.data.token);
      localStorage.setItem('empyrict_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('empyrict_token', response.data.token);
      localStorage.setItem('empyrict_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/me', profileData);
    if (response.data.user) {
      localStorage.setItem('empyrict_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('empyrict_token');
    localStorage.removeItem('empyrict_user');
  }
};
