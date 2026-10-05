import React from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { Bus, FileText, ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

/**
 * Terms of Service legal page for Wasalt platform.
 */
export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        `By accessing or using the ${PRODUCT_CONFIG.name} platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of a company or organization ("Organization"), you represent that you have the authority to bind that Organization to these Terms.`,
        'If you do not agree to these Terms, you must not access or use the Service.',
      ],
    },
    {
      title: '2. Description of Service',
      content: [
        `${PRODUCT_CONFIG.name} is a multi-tenant, cloud-based transportation management platform that enables organizations to manage bus fleets, drivers, routes, and real-time vehicle tracking. The Service includes a web application, administration dashboard, and supporting APIs.`,
        'We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with reasonable notice when possible.',
      ],
    },
    {
      title: '3. Account Registration & Security',
      content: [
        'To use the Service, you must create an administrator account and a company workspace. You are responsible for maintaining the confidentiality of your account credentials, including any two-factor authentication (2FA) secrets.',
        'You agree to: provide accurate and complete registration information; promptly update your information if it changes; notify us immediately of any unauthorized use of your account; not share your account credentials with unauthorized individuals.',
        'You are solely responsible for all activity that occurs under your account.',
      ],
    },
    {
      title: '4. Subscription Plans & Payment',
      content: [
        `${PRODUCT_CONFIG.name} offers tiered subscription plans (Starter, Pro, Enterprise) as described on our pricing page. Features, limits, and pricing are subject to change with reasonable advance notice.`,
        'By selecting a paid plan, you agree to pay the applicable fees. All fees are non-refundable except as expressly stated in these Terms or required by applicable law. We may suspend access to the Service if payment is overdue.',
        'Free trial periods, when offered, include full Pro features and convert to a paid subscription unless cancelled before the trial expires.',
      ],
    },
    {
      title: '5. Multi-Tenant Architecture & Data Ownership',
      content: [
        'Each Organization operates within an isolated workspace (tenant). Your Organization retains full ownership of all data uploaded to or generated within your workspace, including fleet data, driver records, routes, passenger information, and telemetry data ("Your Data").',
        `${PRODUCT_CONFIG.name} does not claim ownership of Your Data. We process Your Data solely to provide and improve the Service, as described in our Privacy Policy.`,
        'You are responsible for ensuring that Your Data complies with all applicable laws and does not infringe any third-party rights.',
      ],
    },
    {
      title: '6. Acceptable Use',
      content: [
        'You agree not to: use the Service for any illegal purpose; attempt to gain unauthorized access to other organizations\' workspaces or data; interfere with or disrupt the Service or its infrastructure; reverse engineer, decompile, or disassemble any part of the Service.',
        'You also agree not to: upload malicious code, viruses, or harmful content; use the Service to track individuals without their knowledge or consent; resell or redistribute the Service without our written authorization; exceed the usage limits of your subscription plan.',
      ],
    },
    {
      title: '7. Intellectual Property',
      content: [
        `The Service, including its software, design, branding, documentation, and all related intellectual property, is owned by ${PRODUCT_CONFIG.legalName}. These Terms do not grant you any rights to our intellectual property except the limited right to use the Service as described herein.`,
        'You may not use our trademarks, logos, or branding without prior written consent.',
      ],
    },
    {
      title: '8. Service Availability & Support',
      content: [
        'We strive to maintain high availability of the Service but do not guarantee uninterrupted or error-free operation. Scheduled maintenance windows will be communicated in advance when possible.',
        'Support levels and response times vary by subscription plan. Enterprise customers receive priority support with dedicated account management.',
      ],
    },
    {
      title: '9. Termination',
      content: [
        'Either party may terminate these Terms at any time. You may terminate by deleting your account and all company workspaces. We may terminate or suspend your access for violation of these Terms, non-payment, or for any reason with 30 days\' written notice.',
        'Upon termination, your right to access the Service ceases immediately. We will retain Your Data for 90 days following termination, after which it will be permanently deleted unless legally required to retain it.',
      ],
    },
    {
      title: '10. Limitation of Liability',
      content: [
        `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${PRODUCT_CONFIG.legalName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, BUSINESS INTERRUPTION, OR LOSS OF PROFITS.`,
        'OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.',
      ],
    },
    {
      title: '11. Governing Law',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Cairo, Egypt.',
      ],
    },
    {
      title: '12. Changes to Terms',
      content: [
        'We may update these Terms from time to time. We will notify you of material changes by posting the revised Terms on our website and sending a notification to your registered email address. Your continued use of the Service after such changes constitutes acceptance.',
      ],
    },
    {
      title: '13. Contact',
      content: [
        `For questions about these Terms, please contact us at ${PRODUCT_CONFIG.supportEmail}.`,
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Legal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Terms of Service
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
            Please read these Terms of Service carefully before using the {PRODUCT_CONFIG.name}{' '}
            platform operated by {PRODUCT_CONFIG.legalName}.
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
