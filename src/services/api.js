import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= TOKEN ATTACH =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= TOKEN REFRESH =================
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');

        const r = await axios.post(
          `${API_URL}/auth/token/refresh/`,
          { refresh }
        );

        localStorage.setItem('access_token', r.data.access);
        original.headers.Authorization = `Bearer ${r.data.access}`;

        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

// ================= AUTH =================
export const register = (data) => api.post('/auth/register/', data);

export const login = (username, password) =>
  api.post('/auth/login/', { username, password });

export const logout = (refresh) =>
  api.post('/auth/logout/', { refresh_token: refresh });

export const refreshAccessToken = (refresh) =>
  axios.post(`${API_URL}/auth/token/refresh/`, { refresh });

// ================= PROFILE =================
export const getProfile = () => api.get('/profile/');

export const updateProfile = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => v != null && fd.append(k, v));
  return api.put('/profile/', fd);
};

// ================= POSTS =================
export const getPosts = (params = {}) => api.get('/posts/', { params });

export const getPost = (slug) => api.get(`/posts/${slug}/`);

export const getMyPosts = () => api.get('/posts/my_posts/');

export const createPost = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => v != null && fd.append(k, v));
  return api.post('/posts/', fd);
};

export const updatePost = (slug, data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => v != null && fd.append(k, v));
  return api.put(`/posts/${slug}/`, fd);
};

export const deletePost = (slug) => api.delete(`/posts/${slug}/`);

export const getFeaturedPosts = () => api.get('/posts/featured/');

export const getPopularPosts = () => api.get('/posts/popular/');

export const getPostsByCategory = (category, params = {}) =>
  api.get('/posts/by_category/', { params: { category, ...params } });

// ================= CATEGORIES =================
export const getCategories = () => api.get('/categories/');

export const getCategory = (slug) => api.get(`/categories/${slug}/`);

// ================= COMMENTS =================
export const getComments = (post) =>
  api.get('/comments/', { params: { post } });

export const createComment = (data) => api.post('/comments/', data);

export default api;
