// TypeScript's resolver uses this shared file; Metro selects appleAuth.web.ts
// for the website and this native implementation for iOS/Android.
import { appleAuth } from '@invertase/react-native-apple-authentication';

export { appleAuth };
