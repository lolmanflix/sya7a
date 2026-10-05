import React from 'react';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { LEGAL_CONTENT, LegalDocId } from '../../content/legalContent';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

interface LegalPageProps {
  doc: LegalDocId;
  /** Returns to the marketing home page. */
  onBack: () => void;
}

/**
 * Full-page legal document (Privacy Policy / Terms of Service),
 * rendered in the active UI language (EN/AR) with RTL support.
 */
export const LegalPage: React.FC<LegalPageProps> = ({ doc, onBack }) => {
  const { language } = useLanguageTheme();
  const content = LEGAL_CONTENT[doc][language === 'ar' ? 'ar' : 'en'];
  const isRtl = language === 'ar';
  const isPrivacy = doc === 'privacy';

  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        {/* Back to home */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {isRtl ? 'العودة للرئيسية' : 'Back to home'}
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            {isPrivacy ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {content.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {content.updated}
            </p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          {content.intro}
        </p>

        {/* Sections */}
        <div className="mt-8 space-y-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {section.heading}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-colors">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            {content.contactHeading}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.contact}
          </p>
        </div>

        <div className="mt-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {isRtl ? 'العودة للرئيسية' : 'Back to home'}
          </button>
        </div>
      </div>
    </section>
  );
};
