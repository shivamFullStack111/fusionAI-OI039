// production means project is live and import.meta.env.VITE_API_URL provided in vercel environment when this site is live then VITE_API_URL exists
export const isInProduction = import.meta.env.VITE_API_URL ? true : false;

// export const DB_URL = '/api';
export const DB_URL = isInProduction
  ? "https://ai-agent-saas-s1ie.onrender.com/api"
  : "http://localhost:7474/api";
