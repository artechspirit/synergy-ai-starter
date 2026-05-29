import I18n from 'i18n-js';
import * as Localization from 'expo-localization';

import en from '../../../../packages/translations/locales/en.json';
import id from '../../../../packages/translations/locales/id.json';

export function setupI18n() {
  I18n.translations = { en, id };
  I18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
  I18n.fallbacks = true;
  I18n.defaultLocale = 'en';
}

export function useI18n() {
  function t(key: string, options?: Record<string, unknown>): string {
    return I18n.t(key, options);
  }
  return { t, locale: I18n.locale };
}
