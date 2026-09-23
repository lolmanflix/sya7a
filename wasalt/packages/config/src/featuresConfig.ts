/**
 * Centralized Features & Value Propositions for Marketing & Product
 */

export interface FeatureCard {
  id: string;
  category: string;
  title: string;
  description: string;
  badge?: string;
  icon: string; // Lucide icon identifier
  metrics?: string;
}

export const PLATFORM_FEATURES: FeatureCard[] = [
  {
    id: 'multi-tenant',
    category: 'Architecture',
    title: 'Multi-Tenant Workspace Engine',
    description:
      'Manage multiple subsidiaries, client brands, or municipal regions from a single master login. Each company receives complete cryptographic and logical data isolation.',
    badge: 'Zero Bleed',
    icon: 'Layers',
    metrics: '100% Tenant Isolation',
  },
  {
    id: 'dynamic-theming',
    category: 'Branding',
    title: 'Instant Brand & Theme Synthesis',
    description:
      'Upload a brand logo and watch our engine automatically extract dominant tones, construct an accessible color palette, and apply it seamlessly across the entire workspace.',
    badge: 'WCAG AA Compliant',
    icon: 'Palette',
    metrics: '0.2s Theme Generation',
  },
  {
    id: 'rbac-governance',
    category: 'Security',
    title: 'Granular Role-Based Access Control',
    description:
      'Assign distinct roles (Owner, Admin, Manager) per company. An administrator can be an Owner in Company A and a restricted Manager in Company B without friction.',
    badge: 'RBAC Matrix',
    icon: 'ShieldCheck',
    metrics: '3 Default Roles',
  },
  {
    id: 'desktop-ready',
    category: 'Cross-Platform',
    title: 'Web & Desktop Sync',
    description:
      'Access the full platform through any modern web browser or deploy our native Electron desktop application for hardware-accelerated workstation performance.',
    badge: 'Electron Shell',
    icon: 'Monitor',
    metrics: 'Mac, Windows, Linux',
  },
  {
    id: 'realtime-telemetry',
    category: 'Operations',
    title: 'Live Operational Telemetry',
    description:
      'Gain immediate visibility into active members, fleet status, dispatches, and audit trails. Real-time synchronizations ensure your team never operates on stale data.',
    badge: 'Sub-second Sync',
    icon: 'Zap',
    metrics: 'Live Activity Stream',
  },
  {
    id: 'developer-apis',
    category: 'Integrations',
    title: 'Extensible REST & Webhook APIs',
    description:
      'Export operational reports, integrate with existing ERP systems, or trigger custom webhook automation upon key membership or status mutations.',
    badge: 'Open Ecosystem',
    icon: 'Code2',
    metrics: 'Webhook Subscriptions',
  },
];
