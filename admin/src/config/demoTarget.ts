/**
 * Optional demo/test driver target for the SafeTrip monitoring modal.
 *
 * Values are injected from `admin/.env` (gitignored). When `VITE_DEMO_DRIVER_UID`
 * is unset the "Target Active Driver" switch control is hidden entirely — no
 * hardcoded identities or UIDs may ship in the bundle (dev_rules #3).
 */

const uid = import.meta.env.VITE_DEMO_DRIVER_UID as string | undefined;
const name = import.meta.env.VITE_DEMO_DRIVER_NAME as string | undefined;

/** UID of the configured demo driver handset, or undefined when not configured. */
export const demoDriverUid: string | undefined = uid?.trim() || undefined;

/** Display label for the configured demo driver, or undefined when not configured. */
export const demoDriverName: string | undefined = name?.trim() || undefined;
