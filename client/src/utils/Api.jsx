import axios from "axios";

// force using hosted URL in production (Railway, etc.)
const isProduction = typeof window !== "undefined" && window.location.hostname !== "localhost";

const url = isProduction
  ? "https://malak-sewing-production.up.railway.app"
  : "http://localhost:5000";

const Api = axios.create({
  baseURL: url,
});

export { Api };