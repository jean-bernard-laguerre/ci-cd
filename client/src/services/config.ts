import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ajouter l'id du user dans le header

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.Id) {
    config.headers.userId = `${user.Id}`;
  }
  return config;
});

export default instance;
