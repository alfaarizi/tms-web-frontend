import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import checker from 'vite-plugin-checker';
import runtimeEnv from 'vite-plugin-runtime-env';

// Dev server config
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDynamicEnvLoadingActive = env.VITE_CONFIG_MODE === 'env';

    return {
        plugins: [
            react(),
            checker({
                typescript: true,
            }),
            nodePolyfills({
                globals: {
                    Buffer: true,
                    global: true,
                    process: true,
                },
                protocolImports: true,
            }),
            isDynamicEnvLoadingActive && runtimeEnv({
                substitutionSyntax: 'dollar-curly', // Placeholders: ${VITE_VAR_NAME}
                injectHtml: true,
                ignoreEnv: [
                    'VITE_BASE_URL',
                    'VITE_DEV_PROXY',
                    'VITE_BACKEND_CORE_VERSION_RANGE',
                    'VITE_NAME',
                    'VITE_VERSION',
                    'VITE_TIMEOUT_AFTER_FAILED_LOGIN',
                ],
            }),
        ].filter((plugin) => !!plugin),
        base: env.VITE_BASE_URL,
        resolve: {
            alias: [{
                find: '@',
                replacement: '/src',
            }],
        },
        server: {
            port: 3000,
            proxy: {
                '/backend-core': {
                    target: env.VITE_DEV_PROXY,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/backend-core/, ''),
                },
            },
        },
    };
});
