/**
 * Firebase Cloud Function: checkoutApi
 *
 * Firebase Hosting rewrites /api/** here (see wasalt/firebase.json), so the
 * marketing site at https://tracking-72393.web.app talks to the same origin —
 * no CORS, no second hostname. Secrets come from functions/.env at deploy time.
 */
import { onRequest } from 'firebase-functions/v2/https';
import { handleCheckoutApi } from './handler.mjs';

export const checkoutApi = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 30,
    cors: true,
    invoker: 'public',
  },
  async (req, res) => {
    await handleCheckoutApi(req, res);
  }
);
