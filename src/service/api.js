import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/api",
});

// Request interceptor - her istekte token'ı header'a ekle

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const base64Credentials = btoa(`${email}:${password}`);
    const authHeader = `Basic ${base64Credentials}`;

    const response = await api.post("/auth/login", null, {
      headers: {
        Authorization: authHeader,
      },
    });

    // Login başarılı olduğunda token'ı localStorage'a kaydet
    localStorage.setItem("auth", authHeader);

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },
};

export default api;
