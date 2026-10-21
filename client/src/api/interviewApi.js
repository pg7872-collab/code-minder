import axiosClient from './axiosClient.js';

export const interviewApi = {
  startInterview: (config) => axiosClient.post('/interviews/start', config),
  submitAnswer: (sessionId, answerData) => axiosClient.post(`/interviews/${sessionId}/answer`, answerData),
  completeInterview: (sessionId) => axiosClient.post(`/interviews/${sessionId}/complete`),
  getHistory: () => axiosClient.get('/interviews/history'),
  getById: (sessionId) => axiosClient.get(`/interviews/${sessionId}`),
};
