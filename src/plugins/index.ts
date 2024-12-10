import { App } from 'vue';
import router from '@/router';
import i18n from './i18n';
import elementPlus from './element-plus';

export const registerPlugins = (app: App) => {
  app
    .use(router)
    .use(i18n)
    .use(elementPlus);
}