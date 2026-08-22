import api from './axios';

export const fetchDashboard = () => api.get('/dashboard').then((res) => res.data);

export const fetchTransactions = (params) =>
  api.get('/transactions', { params }).then((res) => res.data);

export const createTransaction = (data) =>
  api.post('/transactions', data).then((res) => res.data);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data).then((res) => res.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((res) => res.data);
