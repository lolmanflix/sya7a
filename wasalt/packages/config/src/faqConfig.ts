/**
 * Frequently Asked Questions configuration
 */
import { FAQItem } from '../../types/src/marketing';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Wasalt?',
    answer:
      'Wasalt is a B2B transportation management platform that helps schools, companies, and organizations manage buses, drivers, routes, stops, and transportation operations with real-time fleet visibility.',
  },
  {
    id: 'faq-2',
    category: 'branding',
    question: 'Who is Wasalt for?',
    answer:
      'Wasalt is designed for schools, companies, universities, transportation departments, and organizations that operate transportation fleets.',
  },
  {
    id: 'faq-3',
    category: 'security',
    question: 'Can schools use Wasalt?',
    answer:
      'Yes. Schools can use Wasalt to organize school buses, drivers, routes, stops, and transportation operations from one platform.',
  },
  {
    id: 'faq-4',
    category: 'pricing',
    question: 'Can companies use Wasalt?',
    answer:
      'Yes. Companies can use Wasalt to manage employee transportation, including company buses, routes, stops, and transportation administration.',
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'Can multiple administrators manage one organization?',
    answer:
      'Yes. Wasalt supports multiple administrators and role-based access so transportation responsibilities can be shared appropriately.',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Can one administrator manage multiple organizations?',
    answer:
      'Yes. The multi-tenant organization model supports managing more than one transportation operation from a secure account.',
  },
];
