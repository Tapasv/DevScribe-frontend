import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register/', userData);
export const login = (username, password) => api.post('/auth/login/', { username, password });
export const logout = (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken });
export const refreshAccessToken = (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken });
export const changePassword = (oldPassword, newPassword) => 
  api.put('/auth/change-password/', { old_password: oldPassword, new_password: newPassword });

// Profile APIs
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return api.put('/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Posts APIs
export const getPosts = (params = {}) => api.get('/posts/', { params });
export const getPost = (slug) => api.get(`/posts/${slug}/`);
export const getMyPosts = () => api.get('/posts/my_posts/');
export const createPost = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return api.post('/posts/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updatePost = (slug, data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return api.put(`/posts/${slug}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deletePost = (slug) => api.delete(`/posts/${slug}/`);
export const getFeaturedPosts = () => api.get('/posts/featured/');
export const getPopularPosts = () => api.get('/posts/popular/');
export const getPostsByCategory = (categorySlug, params = {}) => 
  api.get('/posts/by_category/', { params: { category: categorySlug, ...params } });

// Categories APIs
export const getCategories = () => api.get('/categories/');
export const getCategory = (slug) => api.get(`/categories/${slug}/`);

// Comments APIs
export const getComments = (postSlug) => api.get('/comments/', { params: { post: postSlug } });
export const createComment = (data) => api.post('/comments/', data);

export default api;