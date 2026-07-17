import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-500">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6">
        <ArrowLeft className="h-4 w-4" /> Back to landing page
      </Link>
    </div>
  );
}
