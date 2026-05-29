import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Page Not Found</h2>
      <p className="text-neutral-500">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Go Home
      </Link>
    </div>
  );
}
