import api from './api';

export const employeeService = {
  async getEmployees(params = {}) {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  async getEmployeeById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  async createEmployee(employeeData) {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  async updateEmployee(id, employeeData) {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  async deleteEmployee(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  async analyzeEmployee(employeeData) {
    const response = await api.post('/employees/analyze', employeeData);
    return response.data;
  },

  async uploadCSV(formData) {
    const response = await api.post('/employees/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async clearAll() {
    const response = await api.post('/employees/clear-all');
    return response.data;
  }
};
