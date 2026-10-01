import React from 'react';
import { useLanguageTheme } from '../context/LanguageThemeContext';
import { Button } from './common/Button';
import { CheckCircle2, Download, Monitor, Laptop, Terminal, ExternalLink, Bus } from 'lucide-react';

interface DownloadPageProps {
  companyName?: string;
  onGoToDashboard: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ companyName = 'Your Workspace', onGoToDashboard }) => {
  const { t } = useLanguageTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Bus className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Wasalt</span>
        </div>

        <Button variant="outline" onClick={onGoToDashboard} icon={<ExternalLink className="w-4 h-4" />}>
          {t('download.web')}
        </Button>
      </header>

      {/* Main Download Section */}
      <main className="max-w-4xl mx-auto w-full my-12 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment Successful & Company Workspace Activated!</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {t('download.title')}
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            {t('download.sub')} <strong className="text-white">{companyName}</strong>.
          </p>
        </div>

        {/* Operating Systems Download Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* macOS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between gap-6 hover:border-blue-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Laptop className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white">macOS Client</h3>
              <p className="text-xs text-slate-400">v1.2.0 • Universal Binary</p>
            </div>
            <Button
              variant="primary"
              className="w-full justify-center bg-blue-600 hover:bg-blue-500"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Starting macOS download (.dmg)...')}
            >
              macOS (.dmg)
            </Button>
          </div>

          {/* Windows */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between gap-6 hover:border-blue-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Monitor className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white">Windows Client</h3>
              <p className="text-xs text-slate-400">v1.2.0 • x64 Installer</p>
            </div>
            <Button
              variant="primary"
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-500"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Starting Windows download (.exe)...')}
            >
              Windows (.exe)
            </Button>
          </div>

          {/* Linux */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between gap-6 hover:border-blue-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Terminal className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white">Linux Client</h3>
              <p className="text-xs text-slate-400">v1.2.0 • AppImage / deb</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-center border-slate-700 hover:bg-slate-800 text-white"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Starting Linux download (.AppImage)...')}
            >
              Linux (.AppImage)
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 pt-8 border-t border-slate-800">
        © 2026 Wasalt Platform Inc. All rights reserved.
      </footer>
    </div>
  );
};
