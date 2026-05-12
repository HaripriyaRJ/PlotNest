export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn("VITE_API_URL is not defined in the environment variables!");
}
export const BASE_URL = API_URL ? API_URL.replace(/\/api$/, '') : "";
