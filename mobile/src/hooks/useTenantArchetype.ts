/**
 * @file useTenantArchetype.ts
 * @description Data-driven white-label tenant archetype resolution.
 * Resolves the active TenantArchetype for the signed-in user with the priority:
 * 1. Driver company override -> companies/<companyId>/tenantArchetype (validated).
 * 2. User profile fields -> users/<uid>/tenantArchetype | archetype | company(id).
 * 3. ACTIVE_TENANT default from tenantConfig.
 * Resolutions are cached per uid + role so consumers never re-query per render.
 */

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useUserType } from "../contexts/UserTypeContext";
import { ACTIVE_TENANT, TenantArchetype } from "../config/tenantConfig";
import { getDriverCompanyId } from "../utils/driverStorage";

/** Known archetype identifiers, mirrored from the TENANT_PROFILES keys. */
const VALID_ARCHETYPES: readonly string[] = [
  "public_transit",
  "school",
  "call_center",
  "university",
  "corporate_fleet",
];

/** RTDB-safe id: rejects path separators and reserved characters. */
const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

/** Resolved archetype cache keyed by `${uid}:${role}` (survives remounts). */
const resolvedCache = new Map<string, TenantArchetype>();
/** In-flight dedupe so simultaneous mounts share a single RTDB read. */
const inFlight = new Map<string, Promise<TenantArchetype>>();

/**
 * Type guard validating a raw RTDB value against the TenantArchetype union.
 */
function isTenantArchetype(value: unknown): value is TenantArchetype {
  return typeof value === "string" && VALID_ARCHETYPES.includes(value);
}

/**
 * Reads companies/<companyId>/tenantArchetype, returning null when missing,
 * malformed, or unreadable so callers can fall through safely.
 */
async function readCompanyArchetype(companyId: string): Promise<TenantArchetype | null> {
  if (!SAFE_ID_PATTERN.test(companyId)) return null;
  try {
    const snap = await get(ref(database, `companies/${companyId}/tenantArchetype`));
    const value = snap.val();
    return isTenantArchetype(value) ? value : null;
  } catch (error) {
    console.warn("[TenantArchetype] Company archetype read failed:", error);
    return null;
  }
}

/**
 * Reads the driver's assigned companyId from drivers/<uid>, falling back to
 * the locally persisted company id (same pattern as useDriverProfile).
 */
async function readDriverCompanyId(uid: string): Promise<string | null> {
  try {
    const snap = await get(ref(database, `drivers/${uid}`));
    const value = snap.val()?.companyId;
    if (typeof value === "string" && value.length > 0) return value;
  } catch (error) {
    console.warn("[TenantArchetype] Driver profile read failed:", error);
  }
  try {
    return await getDriverCompanyId();
  } catch {
    return null;
  }
}

/**
 * Reads the passenger/user profile for a direct archetype field or a
 * company reference that resolves to one.
 */
async function readProfileArchetype(uid: string): Promise<TenantArchetype | null> {
  try {
    const snap = await get(ref(database, `users/${uid}`));
    const profile = snap.val() || {};
    const direct = profile.tenantArchetype ?? profile.archetype;
    if (isTenantArchetype(direct)) return direct;
    const companyRef = profile.company ?? profile.companyId;
    if (typeof companyRef === "string" && companyRef.length > 0) {
      return readCompanyArchetype(companyRef);
    }
  } catch (error) {
    console.warn("[TenantArchetype] User profile read failed:", error);
  }
  return null;
}

/**
 * Resolves the active tenant archetype for a signed-in user (cached + deduped).
 *
 * @param uid - Firebase Auth uid of the active account.
 * @param userType - Active role: drivers consult company overrides first.
 * @returns Validated archetype, or ACTIVE_TENANT when nothing resolves.
 */
async function resolveTenantArchetype(
  uid: string,
  userType: string | null
): Promise<TenantArchetype> {
  const cacheKey = `${uid}:${userType ?? "unknown"}`;
  const cached = resolvedCache.get(cacheKey);
  if (cached) return cached;
  const pending = inFlight.get(cacheKey);
  if (pending) return pending;

  const task = (async (): Promise<TenantArchetype> => {
    let resolved: TenantArchetype | null = null;

    if (userType === "driver") {
      const companyId = await readDriverCompanyId(uid);
      if (companyId) resolved = await readCompanyArchetype(companyId);
    }
    if (!resolved) resolved = await readProfileArchetype(uid);

    const result = resolved ?? ACTIVE_TENANT;
    resolvedCache.set(cacheKey, result);
    inFlight.delete(cacheKey);
    return result;
  })().catch((error): TenantArchetype => {
    inFlight.delete(cacheKey);
    console.warn("[TenantArchetype] Resolution failed; using default:", error);
    return ACTIVE_TENANT;
  });

  inFlight.set(cacheKey, task);
  return task;
}

/**
 * Resolves and caches the active white-label tenant archetype for the
 * current session. Safe to call from any provider or screen; signed-out
 * callers immediately receive the ACTIVE_TENANT default.
 *
 * @returns Validated TenantArchetype for branding and vocabulary lookups.
 */
export function useTenantArchetype(): TenantArchetype {
  const { user } = useAuth();
  const { userType } = useUserType();
  const uid = user?.uid ?? null;

  const [archetype, setArchetype] = useState<TenantArchetype>(() => {
    if (!uid) return ACTIVE_TENANT;
    return resolvedCache.get(`${uid}:${userType ?? "unknown"}`) ?? ACTIVE_TENANT;
  });

  useEffect(() => {
    if (!uid) {
      setArchetype(ACTIVE_TENANT);
      return;
    }
    let cancelled = false;
    resolveTenantArchetype(uid, userType).then((resolved) => {
      if (!cancelled) setArchetype(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [uid, userType]);

  return archetype;
}
