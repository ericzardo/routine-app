import axios from "axios";

// This URL is for Android localhost
const baseURL = "http://10.0.2.2:3333";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Access-Control-Allow-Origin": "*" },
});

export default api;
