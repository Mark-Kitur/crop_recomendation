import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // change to your backend
  withCredentials: true, // ensures cookies (JWT) are sent
});

export default api;
