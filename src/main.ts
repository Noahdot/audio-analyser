import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { loadLocaleMessages } from './utils/i18n';
import router from './router';
import './style.css';
import App from './App.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: loadLocaleMessages()
});

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');
