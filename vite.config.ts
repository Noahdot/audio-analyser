import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      Icons({
        scale: 2,
        autoInstall: true,
        compiler: 'vue3'
      })
    ],
    base: env.VITE_BASE_URL,
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('src', import.meta.url)) }
      ]
    }
  }
});
