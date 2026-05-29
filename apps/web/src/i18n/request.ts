import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@repo/translations';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    messages: (await import(`../../../../packages/translations/locales/${locale}.json`)).default,
  };
});
