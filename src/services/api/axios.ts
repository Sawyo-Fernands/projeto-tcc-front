import axios from "axios";


export const api = axios.create({
    baseURL:"http://localhost:5000/"
})

api.interceptors.request.use(
    (config) => {
      // Aqui você pode adicionar o cabeçalho de autorização (Bearer token)
      const token = localStorage.getItem("tokenTCC"); // Recupere o token de onde você o armazena
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );