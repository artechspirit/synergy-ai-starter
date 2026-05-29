import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from '@repo/translations';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  // Match all pathnames except for API routes, static files, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
