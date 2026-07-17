import type { ReactNode } from 'react';

interface A4LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: string;
  showHeader?: boolean;
}

export function A4Layout({ children, title, subtitle, footer, showHeader = true }: A4LayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[820px] print-area">
      <div className="relative bg-white p-8 shadow-elevated ring-1 ring-ink-200/60 sm:p-12 print:shadow-none print:ring-0">
        {showHeader && (
          <header className="mb-8 flex items-center justify-between border-b-2 border-ink-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
                <span className="font-display text-sm font-bold leading-none">IITM</span>
              </div>
              <div>
                <p className="font-display text-base font-bold text-ink-900">Indian Institute of Technology Madras</p>
                <p className="text-xs text-ink-500">Chennai, Tamil Nadu — 600036</p>
              </div>
            </div>
            {title && (
              <div className="text-right">
                <p className="text-sm font-semibold text-ink-900">{title}</p>
                {subtitle && <p className="text-xs text-ink-500">{subtitle}</p>}
              </div>
            )}
          </header>
        )}
        <main>{children}</main>
        {footer && (
          <footer className="mt-10 border-t border-ink-200 pt-4 text-center text-[11px] text-ink-400">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
