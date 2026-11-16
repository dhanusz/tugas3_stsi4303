import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  // base relatif agar hasil build bisa dibuka dari folder mana pun
  // (mis. http://localhost/tugas3_stsi4303/app/ pada web server Apache)
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Modul pihak ketiga dianggap tanpa side-effect agar komponen Ionic
    // yang tidak dipakai aplikasi ikut terbuang (tree-shaking). File CSS
    // tetap dianggap punya side-effect agar gaya tidak hilang.
    // Sumber masalah: @ionic/core tidak menulis "sideEffects": false di
    // package.json-nya, sehingga bundler menyimpan semua 199 komponen.
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: (id: string) => id.includes('.css') || !id.includes('node_modules'),
      },
      output: {
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            { name: 'ionic', test: /node_modules\/@ionic\// },
            { name: 'vendor', test: /node_modules\// },
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Playwright e2e specs live in tests/e2e.
    include: ['tests/unit/**/*.spec.{js,ts}'],
  },
});
