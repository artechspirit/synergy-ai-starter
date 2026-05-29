export type Locale = 'en' | 'id';

export const locales: Locale[] = ['en', 'id'];
export const defaultLocale: Locale = 'en';

export type TranslationKeys = typeof import('../locales/en.json');
