// Centralized runtime configuration for the web app
// Values are read from Vite envs and have safe defaults for dev

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "/") ||
  "https://api.adventband.org/api/v1/";

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  "wss://api.adventband.org";

export const API_KEY = import.meta.env.VITE_API_KEY || "";

