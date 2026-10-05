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
    id: 'live-tracking',
    category: 'Live visibility',
    title: 'Live Bus Tracking',
    description:
      'Monitor active buses and their current route progress from a centralized transportation view.',
    badge: 'Fleet view',
    icon: 'MapPinned',
    metrics: 'Active vehicle visibility',
  },
  {
    id: 'fleet-management',
    category: 'Fleet operations',
    title: 'Fleet Management',
    description:
      'Keep your organization’s buses organized in one place alongside transportation operations.',
    badge: 'Centralized',
    icon: 'Bus',
    metrics: 'Buses and operations',
  },
  {
    id: 'route-management',
    category: 'Route planning',
    title: 'Route & Stop Management',
    description:
      'Create and maintain routes, transportation stops, and the information your team needs to run them.',
    badge: 'Organized',
    icon: 'Route',
    metrics: 'Routes and stops',
  },
  {
    id: 'driver-management',
    category: 'Driver operations',
    title: 'Driver Management',
    description:
      'Give transportation staff a clear way to manage drivers and assigned vehicles and routes.',
    badge: 'Assignments',
    icon: 'Users',
    metrics: 'Drivers and routes',
  },
  {
    id: 'scheduling',
    category: 'Scheduling',
    title: 'Transportation Scheduling',
    description:
      'Organize transportation schedules and route operations around your school or company.',
    badge: 'Operations',
    icon: 'CalendarClock',
    metrics: 'Schedules in one place',
  },
  {
    id: 'organization-management',
    category: 'Organization',
    title: 'Role-Based Organization Management',
    description:
      'Support multiple transportation administrators with appropriate organization-level access.',
    badge: 'Supporting platform',
    icon: 'ShieldCheck',
    metrics: 'Multi-organization ready',
  },
];
