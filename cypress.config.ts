import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000/',
        viewportWidth: 1920,
        viewportHeight: 1080,
        video: true,
        defaultCommandTimeout: 15000,
        setupNodeEvents() {
            // implement node event listeners here
        },
    },
});
