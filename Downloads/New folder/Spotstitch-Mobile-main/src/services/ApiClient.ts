import axios from "axios";

// If you are using ios device, use http://127.0.0.1:8080
export const API_BASE_URL = "http://10.0.2.2:8080";

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default ApiClient; 