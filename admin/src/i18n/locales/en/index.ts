import nav from './nav';
import common from './common';
import dashboard from './dashboard';
import fleet from './fleet';
import routes from './routes';
import companies from './companies';
import drivers from './drivers';
import users from './users';
import security from './security';
import pricing from './pricing';
import auth from './auth';
import safety from './safety';
import map from './map';

/** Flat EN dictionary — keys are namespaced (e.g. `nav.dashboard`, `pricing.savePrices`). */
export const en: Record<string, string> = {
  ...nav,
  ...common,
  ...dashboard,
  ...fleet,
  ...routes,
  ...companies,
  ...drivers,
  ...users,
  ...security,
  ...pricing,
  ...auth,
  ...safety,
  ...map,
};

export default en;
