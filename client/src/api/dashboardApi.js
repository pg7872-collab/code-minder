import axiosClient from './axiosClient.js';

export const dashboardApi = {
  getStats: () => axiosClient.get('/dashboard/stats'),
  getActivity: () => axiosClient.get('/dashboard/activity'),
};
