import axiosClient from './axiosClient.js';

export const contestApi = {
  getContests: (params = {}) => axiosClient.get('/contests', { params }),
  getUpcoming: () => axiosClient.get('/contests/upcoming'),
  getBookmarks: () => axiosClient.get('/contests/bookmarks'),
  bookmarkContest: (id, contestData) => axiosClient.post(`/contests/${id}/bookmark`, contestData),
  removeBookmark: (id) => axiosClient.delete(`/contests/${id}/bookmark`),
};
