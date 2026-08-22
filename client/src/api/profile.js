import api from './axios';

export const createOnboardingProfile = (data) =>
  api.post('/profile/onboarding', data).then((res) => res.data);

export const fetchProfile = () => api.get('/profile').then((res) => res.data);
