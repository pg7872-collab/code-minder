import axiosClient from './axiosClient.js';

export const questionApi = {
  getQuestions: (params = {}) => axiosClient.get('/questions', { params }),
  getQuestionById: (id) => axiosClient.get(`/questions/${id}`),
  createQuestion: (data) => axiosClient.post('/questions', data),
  updateQuestion: (id, data) => axiosClient.put(`/questions/${id}`, data),
  deleteQuestion: (id) => axiosClient.delete(`/questions/${id}`),
  getTopicProgress: () => axiosClient.get('/questions/topic-progress'),
};
