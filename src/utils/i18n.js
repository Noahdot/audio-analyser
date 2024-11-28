export const loadLocaleMessages = () => {
  const modules = import.meta.glob('../locale/*.json', { eager: true });
  const messages = {};
  for (const path in modules) {
    const locale = path.match(/\.\/locale\/(.*)\.json$/)[1];
    messages[locale] = modules[path].default;
  }
  return messages;
}