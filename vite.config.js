/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [],
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      port: 443,
    },
  },
};
