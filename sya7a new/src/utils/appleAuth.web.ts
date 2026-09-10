// The native Apple Authentication module has no web bundle. Keeping a matching
// interface lets the shared auth context load safely for the admin website.
export const appleAuth: any = {
  isSupported: false,
  Operation: { LOGIN: 0 },
  Scope: { EMAIL: 0, FULL_NAME: 0 },
  performRequest: async () => { throw new Error('Apple Sign-In is available in the iOS app only.'); },
};
