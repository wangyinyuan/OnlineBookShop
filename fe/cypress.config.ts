import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
  },
  defaultCommandTimeout: 6000,
  responseTimeout: 30000,
  requestTimeout: 15000,
  video: false,
  screenshotOnRunFailure: true,
  env: {
    apiUrl: "http://localhost:8080/api",
  },
});
