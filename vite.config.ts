/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => {
    console.log('Vite config loaded, mode:', mode);
    return {
        base: '/tellmyscore/',
        plugins: [angular({
            tsconfig: mode === 'test' ? './tsconfig.spec.json' : './tsconfig.app.json'
        })],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['src/test-setup.ts'],
            include: ['src/**/*.spec.ts'],
            reporters: ['default'],
        },
        define: {
            'import.meta.vitest': mode !== 'production',
        },
    };
});
