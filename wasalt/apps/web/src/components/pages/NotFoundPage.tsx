import React from 'react';
import { Home, Download, MapPinOff } from 'lucide-react';
import { Button } from '../common/Button';

interface NotFoundPageProps {
  /** The URL path the browser requested (shown so the user can spot the typo). */
  currentPath?: string;
  onGoHome: () => void;
  /** Optional secondary action — opens the desktop download page. */
  onGoDownload?: () => void;
}

/**
 * 404 page — rendered whenever the URL fails route validation (unknown or
 * malformed path). Keeps the visitor on-site with clear ways back.
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  currentPath,
  onGoHome,
  onGoDownload,
}) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-xl space-y-7">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400">
          <MapPinOff className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <p className="text-7xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
            404
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Page not found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The address you tried to open{' '}
            {currentPath && (
              <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm break-all">
                {currentPath}
              </code>
            )}{' '}
            doesn&apos;t match any page on this site. It may have moved, or the
            link may be mistyped.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onGoHome}
            icon={<Home className="w-4 h-4" />}
            className="justify-center"
          >
            Back to Home
          </Button>

          {onGoDownload && (
            <Button
              variant="outline"
              size="lg"
              onClick={onGoDownload}
              icon={<Download className="w-4 h-4" />}
              className="justify-center"
            >
              Desktop Downloads
            </Button>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-500">
          Valid pages: Home · Pricing (#pricing) · Privacy (#privacy) · Terms
          (#terms) · Download (/download)
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
