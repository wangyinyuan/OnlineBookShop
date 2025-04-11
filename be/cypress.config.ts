import { defineConfig } from "cypress";
import dbPlugin from "./cypress/plugins";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return dbPlugin(on, config);
    },
    baseUrl: "http://localhost:8080",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalRunAllSpecs: true,
  },
  env: {
    apiUrl: "http://localhost:8080/api",
  },
});
