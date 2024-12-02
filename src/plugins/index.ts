import router from '@/router';
import i18n from './i18n';

export const registerPlugins = (app) => {
  app
    .use(router)
    .use(i18n);
}