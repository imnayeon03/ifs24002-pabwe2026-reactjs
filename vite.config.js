import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefix "" agar variabel tanpa awalan VITE_ (APP_PORT, DELCOM_BASEURL) ikut terbaca
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.APP_PORT) || 3000,
    },
    preview: {
      port: Number(env.APP_PORT) || 3000,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(env.DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,jsx}"],
        exclude: [
          "src/main.jsx",
          "src/setupTests.js",
          "src/test-utils.jsx",
          "**/*.test.{js,jsx}",
          "node_modules/**",
        ],
        // Coverage threshold: build gagal jika ada yang di bawah 100%
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  };
});