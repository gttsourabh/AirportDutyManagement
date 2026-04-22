import axiosInstance from './axiosInstance';

export const sendOtpApi = credentials =>
  axiosInstance.post('/auth/send-otp', credentials);

export const verifyOtpApi = payload =>
  axiosInstance.post('/auth/verify-otp', payload);

export const resendOtpApi = userId =>
  axiosInstance.post('/auth/resend-otp', { userId });

export const logoutApi = () =>
  axiosInstance.post('/auth/logout');
