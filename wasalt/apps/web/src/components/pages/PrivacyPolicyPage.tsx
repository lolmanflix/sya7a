import React from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { Bus, Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

/**
 * Privacy Policy legal page for Wasalt platform.
 */
export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        `When you create an account or company workspace on ${PRODUCT_CONFIG.name}, we collect information you provide directly, including your full name, email address, job title, company name, and company branding preferences (such as logo and theme colors).`,
        'We also automatically collect certain technical data when you use our platform, including IP address, browser type, device information, operating system, access times, and pages viewed. Our platform uses cookies and similar tracking technologies to maintain session state and improve user experience.',
        'For fleet and transportation operations, the platform processes GPS coordinates, route data, driver assignments, and vehicle telemetry data that your organization uploads or generates through the platform.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect to: provide, maintain, and improve our transportation management platform; process your account registration and manage your company workspace; send you technical notices, updates, security alerts, and administrative communications.',
        'We also use your data to: provide customer support and respond to inquiries; monitor and analyze usage trends to improve user experience; detect, investigate, and prevent fraudulent transactions and unauthorized access; comply with legal obligations and enforce our terms.',
        'Transportation and fleet telemetry data is processed solely to provide the core platform functionality your organization has subscribed to. We do not sell or share this operational data with third parties for their own purposes.',
      ],
    },
    {
      title: '3. Multi-Tenant Data Isolation',
      content: [
        `${PRODUCT_CONFIG.name} operates as a multi-tenant platform. Each company workspace is logically isolated, meaning that one organization\'s data (including fleet data, driver records, routes, and passenger information) is never accessible to another organization.`,
        'We implement strict access controls, role-based permissions, and tenant-boundary enforcement at both the application and database layers to ensure complete data separation between organizations.',
      ],
    },
    {
      title: '4. Data Sharing & Third Parties',
      content: [
        'We do not sell your personal information or your organization\'s operational data. We may share information with: service providers who perform services on our behalf (such as cloud hosting, analytics, and payment processing); law enforcement or government agencies when required by applicable law or legal process.',
        'We may also share aggregated, anonymized data that cannot reasonably be used to identify you or your organization for industry benchmarking or research purposes.',
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We implement industry-standard security measures to protect your information, including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, and access logging. Our platform supports two-factor authentication (2FA) for administrative accounts.',
        'Despite our efforts, no method of electronic transmission or storage is completely secure. We cannot guarantee absolute security of your data, but we are committed to protecting it using commercially reasonable measures.',
      ],
    },
    {
      title: '6. Data Retention',
      content: [
        'We retain your account information for as long as your account is active or as needed to provide you services. If you or your organization delete your workspace, we will delete or anonymize your data within 90 days, except where we are required to retain it for legal, regulatory, or legitimate business purposes.',
        'Telemetry and fleet tracking data is retained according to your organization\'s subscription plan settings, and can be configured or purged by your company administrator.',
      ],
    },
    {
      title: '7. Your Rights',
      content: [
        'Depending on your jurisdiction, you may have the right to: access the personal information we hold about you; request correction of inaccurate data; request deletion of your personal data; object to or restrict certain processing; data portability; withdraw consent where processing is based on consent.',
        `To exercise any of these rights, please contact us at ${PRODUCT_CONFIG.supportEmail}. We will respond to your request within 30 days.`,
      ],
    },
    {
      title: '8. Cookies & Tracking',
      content: [
        'We use essential cookies to maintain your session and authentication state. We may also use analytics cookies to understand how our platform is used. You can manage cookie preferences through your browser settings.',
        'We do not use third-party advertising cookies or trackers on the platform.',
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and, where appropriate, by sending you an email notification. Your continued use of the platform after changes become effective constitutes acceptance of the revised policy.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        `If you have questions about this Privacy Policy or our data practices, please contact us at ${PRODUCT_CONFIG.supportEmail} or write to: ${PRODUCT_CONFIG.legalName}, Cairo, Egypt.`,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Legal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: September 25, {PRODUCT_CONFIG.copyrightYear} · Effective immediately
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-10">
          <p className="text-sm text-slate-600 leading-relaxed">
            {PRODUCT_CONFIG.legalName} ("{PRODUCT_CONFIG.name}", "we", "our", or "us") is committed
            to protecting the privacy and security of your personal information and your
            organization's operational data. This Privacy Policy describes how we collect, use,
            share, and protect information when you use our multi-tenant transportation management
            platform.
          </p>

          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((paragraph, idx) => (
                  <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
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
