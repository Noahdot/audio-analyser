import { createI18n } from 'vue-i18n';

const loadLocaleMessages = () => {
  const modules = import.meta.glob('../locale/*.json', { eager: true });
  const messages = {};
  for (const path in modules) {
    const match = path.match(/\.\/locale\/(.*)\.json$/);
    const locale = match && match[1];
    if (locale) messages[locale] = modules[path].default;
  }
  return messages;
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: loadLocaleMessages()
});

export default i18n;