import React from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import {
  Bus,
  Shield,
  ArrowLeft,
  Lock,
  Server,
  Eye,
  KeyRound,
  ShieldCheck,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SecurityPageProps {
  onBack: () => void;
}

const SecurityFeature = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

/**
 * Security overview page for Wasalt platform.
 */
export const SecurityPage: React.FC<SecurityPageProps> = ({ onBack }) => {
  const features = [
    {
      icon: Database,
      title: 'Multi-Tenant Data Isolation',
      description:
        'Each organization operates in a fully isolated workspace. Strict tenant-boundary enforcement ensures no data leaks between organizations at both application and database layers.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Lock,
      title: 'Encryption at Rest & In Transit',
      description:
        'All data is encrypted using AES-256 at rest and TLS 1.3 in transit. API communications, database connections, and file storage all use industry-standard encryption protocols.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: KeyRound,
      title: 'Two-Factor Authentication (2FA)',
      description:
        'Master administrators are protected with TOTP-based two-factor authentication. Supports Google Authenticator, Microsoft Authenticator, and Authy for secure login verification.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control (RBAC)',
      description:
        'Granular permission system with roles including Master Admin, Company Admin, Dispatcher, and Viewer. Each role has precisely scoped access to platform features and data.',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Eye,
      title: 'Audit Logging & Monitoring',
      description:
        'Comprehensive audit trail of all administrative actions, login attempts, and data modifications. Real-time monitoring alerts for suspicious activity and unauthorized access attempts.',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: Server,
      title: 'Secure Cloud Infrastructure',
      description:
        'Hosted on enterprise-grade cloud infrastructure with automatic scaling, redundancy, and DDoS protection. Regular security patches and infrastructure updates applied automatically.',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      icon: Globe,
      title: 'WCAG 2.2 AA Accessibility',
      description:
        'The platform is designed to meet WCAG 2.2 Level AA accessibility standards, ensuring usability for all users including those with disabilities.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: AlertTriangle,
      title: 'Incident Response',
      description:
        'Dedicated security incident response process with defined escalation paths. Commitment to transparent communication in the event of any security incident affecting customer data.',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const complianceItems = [
    'Data processing agreements available for enterprise customers',
    'Regular penetration testing and vulnerability assessments',
    'Employee security awareness training program',
    'Vendor security review process for all third-party integrations',
    'Secure software development lifecycle (SSDLC) practices',
    'Automated dependency scanning and vulnerability detection',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Platform Security
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Security & Trust Center
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            {PRODUCT_CONFIG.name} is built with security at its core. We implement
            industry-standard protections to keep your organization's transportation data safe and
            your operations running securely.
          </p>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Security Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature) => (
            <SecurityFeature key={feature.title} {...feature} />
          ))}
        </div>

        {/* Compliance & Practices */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Compliance & Security Practices
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            We continuously invest in our security posture and operational practices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {complianceItems.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Disclosure */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 text-white">
          <h2 className="text-xl font-bold mb-2">Responsible Disclosure</h2>
          <p className="text-sm text-slate-400 mb-4 max-w-2xl">
            We take security vulnerabilities seriously. If you discover a potential security issue,
            please report it responsibly and we will investigate promptly.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">Report to:</span>
            <a
              href={`mailto:${PRODUCT_CONFIG.supportEmail}`}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              {PRODUCT_CONFIG.supportEmail}
            </a>
          </div>
        </div>

        {/* Footer brand */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
            <Bus className="w-4 h-4" />
            <span className="text-xs font-semibold">{PRODUCT_CONFIG.name}</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {PRODUCT_CONFIG.copyrightYear} {PRODUCT_CONFIG.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
