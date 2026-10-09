import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000", //tillater forespørsler til (backend/server) ved innhenting av API database
    },
  },
});
