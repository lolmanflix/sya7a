/**
 * Frequently Asked Questions configuration
 */
import { FAQItem } from '../../types/src/marketing';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Wasalt and how does multi-tenancy work?',
    answer:
      'Wasalt is an enterprise SaaS platform engineered for multi-company operations. One single administrator account can create or join multiple company workspaces. Each company enjoys its own isolated database scope, team directory, custom branding, and billing subscription.',
  },
  {
    id: 'faq-2',
    category: 'branding',
    question: 'How does dynamic theme extraction work?',
    answer:
      'When you upload your company logo, Wasalt processes the image locally in your browser using the HTML5 Canvas API. It extracts the dominant chromatic hues, calculates compliant contrast ratios according to WCAG AA guidelines, and generates a tailored color palette that is applied dynamically via CSS variables across your entire portal.',
  },
  {
    id: 'faq-3',
    category: 'security',
    question: 'Can an admin have different roles in different companies?',
    answer:
      'Yes. Wasalt uses a many-to-many AdminCompanyMembership architecture. You can hold the Owner role in your primary business while holding a limited Manager or Viewer role in an affiliated partner workspace.',
  },
  {
    id: 'faq-4',
    category: 'pricing',
    question: 'Can I change my plan or cancel at any time?',
    answer:
      'Absolutely. You can upgrade, downgrade, or cancel your subscription at any point from the Billing tab in your company settings. All changes take effect at the end of your current billing period with zero cancellation fees.',
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'Is our corporate data safe and isolated?',
    answer:
      'Every query in Wasalt requires explicit tenant verification. Data cannot leak across company boundaries. All transit and storage is encrypted with industry-standard TLS 1.3 and AES-256 protocols.',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Is there a desktop app available?',
    answer:
      'Yes. In addition to our responsive web application, Wasalt provides an Electron desktop application supporting macOS, Windows, and Linux with native notifications and hardware acceleration.',
  },
];
