import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';

const loadLocaleMessages = (): LocaleMessages<VueMessageType> => {
  const modules = import.meta.glob('../locale/*.json', { eager: true });
  const messages: LocaleMessages<VueMessageType> = {};
  for (const path in modules) {
    const match = path.match(/\.\/locale\/(.*)\.json$/);
    const locale = match && match[1];
    if (locale) messages[locale] = (modules[path] as { default: any }).default;
  }
  return messages;
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  messages: loadLocaleMessages()
});

export default i18n;