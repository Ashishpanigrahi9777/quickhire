import client from './client';

export const getApplications = async (params = {}) => {
  const response = await client.get('/applications', { params });
  return response.data;
};

export const getApplication = async (id) => {
  const response = await client.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await client.post('/applications', data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await client.put(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await client.delete(`/applications/${id}`);
  return response.data;
};

export const getApplicationHistory = async (id) => {
  const response = await client.get(`/applications/${id}/history`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await client.get('/applications/stats');
  return response.data;
};

export const exportApplications = async () => {
  const response = await client.get('/applications/export', {
    responseType: 'blob', // Important for downloading files
  });
  return response.data;
};
