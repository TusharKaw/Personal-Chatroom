import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Set to false for development
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.log('No token available');
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', 
      error.response ? `${error.response.status}: ${error.response.data?.message || error.message}` : error.message,
      error.config?.url
    );
    return Promise.reject(error);
  }
);

// Channel APIs
export const channelAPI = {
  getChannels: () => api.get('/channels'),
  getChannelById: (id) => api.get(`/channels/${id}`),
  createChannel: (channelData) => api.post('/channels', channelData),
  updateChannel: (id, channelData) => api.put(`/channels/${id}`, channelData),
  deleteChannel: (id) => api.delete(`/channels/${id}`),
  joinChannel: (id) => api.put(`/channels/${id}/join`),
  leaveChannel: (id) => api.put(`/channels/${id}/leave`),
};

// Message APIs
export const messageAPI = {
  getChannelMessages: (channelId, page = 1, limit = 50) => 
    api.get(`/messages/channel/${channelId}?page=${page}&limit=${limit}`),
  createMessage: (messageData) => api.post('/messages', messageData),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

export default api; 