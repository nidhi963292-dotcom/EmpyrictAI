import api from './api';

export const predictionService = {
  async predictEmployee(employeeId) {
    const response = await api.post(`/employees/${employeeId}/predict`);
    return response.data;
  },

  async getEmployeePredictions(employeeId) {
    const response = await api.get(`/employees/${employeeId}/predictions`);
    return response.data;
  },

  async getAllPredictions(params = {}) {
    const response = await api.get('/predictions', { params });
    return response.data;
  }
};
