/**
 * Marketing landing page data models
 */

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  companyName: string;
  avatarUrl?: string;
  metric?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'branding' | 'security';
}

export interface MetricHighlight {
  value: string;
  label: string;
  description: string;
}

export interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  bulletPoints: string[];
}
