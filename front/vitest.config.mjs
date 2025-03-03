import {defineConfig} from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import {quasar, transformAssetUrls} from '@quasar/vite-plugin';
import jsconfigPaths from 'vite-jsconfig-paths';
import {resolve} from 'path';
import dotenv from 'dotenv';


dotenv.config({ path: '.env.test' });


// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.js',
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      src: resolve(__dirname, './src'),
      boot: resolve(__dirname, 'src/boot'),
    },
  },
  plugins: [
    vue({
      template: {transformAssetUrls},
    }),
    quasar({
      sassVariables: 'src/quasar-variables.scss',
    }),
    jsconfigPaths(),
  ],
});
