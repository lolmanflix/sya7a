/** Security & system hygiene page strings (EN). */
export default {
  'security.title': 'Security & System Hygiene',
  'security.subtitle': 'Role-Based Access Control, database integrity checks, and rule recommendations.',
  'security.rbacTitle': 'Role-Based Access Control (RBAC)',
  'security.rbacSubtitle': 'Strict multi-tenant privilege boundaries',
  'security.superAdminRole': 'Super Administrator',
  'security.unrestricted': 'Unrestricted',
  'security.superAdminDesc':
    'Full authority across all 7 transport authorities, driver line reassignments, live stream termination, and company creation.',
  'security.dispatcherRole': 'Company Dispatcher (e.g. CTA Admin)',
  'security.tenantScoped': 'Tenant-Scoped',
  'security.dispatcherDesc':
    'Restricted strictly to the operator domain (e.g. @cta.eg). Can only create routes and assign drivers belonging to their transit company.',
  'security.hygieneTitle': 'Database Hygiene & Anomaly Detection',
  'security.hygieneSubtitle': 'Automated consistency scanner',
  'security.duplicateDetected': 'Duplicate Node Detected: "BRT" vs "brt"',
  'security.duplicateDescBefore': 'The database contains both lowercase',
  'security.duplicateDescMiddle': '(7 buses, 6 lines) and uppercase',
  'security.duplicateDescAfter':
    '(empty duplicate). Removing the redundant node cleans client queries.',
  'security.cleaning': 'Cleaning...',
  'security.deduplicate': 'Deduplicate & Remove "BRT"',
  'security.cleanSuccess': 'All transit operator keys are clean and normalized. No duplicate nodes detected.',
  'security.cleanError': 'Failed to clean duplicate node',
  'security.cleanToast': 'Successfully removed duplicate test node "BRT". Active "brt" node preserved.',
  'security.credentialGuard': 'Credential Security Guard',
  'security.credentialDescBefore':
    'Firebase Admin service keys and environment tokens are strictly protected by',
  'security.credentialDescAfter': 'and never bundled into client production assets.',
};
