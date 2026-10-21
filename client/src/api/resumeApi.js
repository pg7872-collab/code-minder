import axiosClient from './axiosClient.js';

export const resumeApi = {
  analyzeResume: (formData) =>
    axiosClient.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getHistory: () => axiosClient.get('/resume/history'),
  getById: (id) => axiosClient.get(`/resume/${id}`),
  deleteAnalysis: (id) => axiosClient.delete(`/resume/${id}`),
};
