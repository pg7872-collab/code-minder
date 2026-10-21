import axiosClient from './axiosClient.js';

export const profileApi = {
  getProfile: () => axiosClient.get('/profile'),
  updateProfile: (data) => axiosClient.put('/profile', data),
  syncExternal: (platform, username) => axiosClient.post('/profile/sync-external', { platform, username }),
};
