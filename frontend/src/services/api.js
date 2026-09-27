import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wca_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("wca_token");
      localStorage.removeItem("wca_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Categories
export const getCategories = () => api.get("/categories");

// User requests
export const createRequest = (data) => api.post("/requests", data);
export const getMyRequests = () => api.get("/requests");
export const getRequestById = (id) => api.get(`/requests/${id}`);
export const cancelRequest = (id) => api.put(`/requests/${id}/cancel`);

// Admin
export const getAllRequestsAdmin = (params) => api.get("/admin/requests", { params });
export const getRequestByIdAdmin = (id) => api.get(`/admin/requests/${id}`);
export const updateRequestStatus = (id, data) => api.put(`/admin/requests/${id}/status`, data);
export const getStatistics = () => api.get("/admin/statistics");

export default api;
