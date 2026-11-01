import api from './api';

export const aiService = {
  async generateInsight(employeeId) {
    const response = await api.post(`/employees/${employeeId}/ai-analysis`);
    return response.data;
  },

  async getEmployeeInsights(employeeId) {
    const response = await api.get(`/employees/${employeeId}/ai-insights`);
    return response.data;
  },

  async getAllInsights(params = {}) {
    const response = await api.get('/ai-insights', { params });
    return response.data;
  }
};

export const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getCharts() {
    const response = await api.get('/dashboard/charts');
    return response.data;
  }
};
