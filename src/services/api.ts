import axios from 'axios';
import { API_URL } from '../config';
import { Issue } from '../types';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Issues API
export const fetchIssues = async (page = 1, limit = 6, category?: string, status?: string) => {
  let url = `/api/issues?page=${page}&limit=${limit}`;
  if (category) url += `&category=${category}`;
  if (status) url += `&status=${status}`;
  
  const response = await api.get(url);
  return response.data;
};

export const fetchIssueById = async (id: string) => {
  const response = await api.get(`/api/issues/${id}`);
  return response.data;
};

export const createIssue = async (issueData: Partial<Issue>) => {
  const response = await api.post('/api/issues', issueData);
  return response.data;
};

export const updateIssue = async (id: string, issueData: Partial<Issue>) => {
  const response = await api.put(`/api/issues/${id}`, issueData);
  return response.data;
};

export const deleteIssue = async (id: string) => {
  const response = await api.delete(`/api/issues/${id}`);
  return response.data;
};

export const voteForIssue = async (id: string) => {
  const response = await api.post(`/api/issues/${id}/vote`);
  return response.data;
};

// User API
export const fetchMyIssues = async () => {
  const response = await api.get('/api/users/my-issues');
  return response.data;
};

export const updateIssueStatus = async (id: string, status: 'In Progress' | 'Resolved') => {
  const response = await api.patch(`/api/issues/${id}/status`, { status });
  return response.data as Issue; 
};
export default api;