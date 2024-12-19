import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from "unplugin-icons/vite";
import path from 'path';

const typesPath = path.resolve(__dirname, './src/types');

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
      }),
      AutoImport({
        imports: ['vue'],
        dts: `${typesPath}/auto-imports.d.ts`,
      }),
      Components({
        dts: `${typesPath}/components.d.ts`,
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
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
});
