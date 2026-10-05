/**
 * Company Tenant Service — Real RTDB
 * Writes company data to /companies/{slug}/ in the shared Firebase RTDB.
 * This is the same node the admin dashboard reads — no sync needed.
 */
import { ref, set, get, update } from 'firebase/database';
import { rtdb, auth } from './firebaseClient';
import { Company, CompanyCreatePayload } from '@wasalt/types';

/**
 * Deep-strips `undefined` values (RTDB rejects them anywhere in a payload,
 * including nested objects like theme.presetId from generated themes).
 */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((v) => v !== undefined).map(stripUndefined) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, v]) => {
      if (v !== undefined) out[key] = stripUndefined(v);
    });
    return out as T;
  }
  return value;
}

/**
 * Fetches all companies owned by or associated with a given admin.
 * Reads the admin's companyIds list from /admins/{uid}/, then fetches each company.
 */
export async function fetchCompaniesForAdmin(adminId: string): Promise<Company[]> {
  try {
    const adminSnap = await get(ref(rtdb, `admins/${adminId}`));
    if (!adminSnap.exists()) return [];

    const adminData = adminSnap.val();
    const companyIds: string[] = adminData.companyIds || [];
    if (companyIds.length === 0) return [];

    const companyPromises = companyIds.map(async (id) => {
      const snap = await get(ref(rtdb, `companies/${id}`));
      return snap.exists() ? (snap.val() as Company) : null;
    });

    const results = await Promise.all(companyPromises);
    return results.filter((c): c is Company => c !== null);
  } catch (err) {
    console.error('[CompanyService] fetchCompaniesForAdmin error:', err);
    return [];
  }
}

/**
 * Creates a new company in /companies/{slug}/ and links it to the admin
 * in /admins/{uid}/companyIds.
 */
export async function createCompany(payload: CompanyCreatePayload): Promise<Company> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated. Please sign in before creating a company.');

  const slug =
    payload.slug ||
    payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const now = new Date().toISOString();
  const companyId = slug; // Use slug as the RTDB key (consistent with admin dashboard)

  const newCompany: Company = {
    id: companyId,
    name: payload.name,
    slug,
    logoUrl: payload.logoUrl,
    description: payload.description,
    industry: payload.industry,
    companySize: payload.companySize,
    website: payload.website,
    contactEmail: payload.contactEmail || auth.currentUser?.email || '',
    theme: payload.theme,
    subscriptionPlanId: 'pending',
    subscriptionStatus: 'trialing',
    createdAt: now,
    updatedAt: now,
  };

  // Write to /companies/{slug}/ — same node admin dashboard reads.
  // Deep-stripped first: RTDB rejects `undefined` anywhere in the payload
  // (e.g. optional logoUrl/description, or theme.presetId on generated themes).
  await set(
    ref(rtdb, `companies/${companyId}`),
    stripUndefined({
      ...newCompany,
      ownerId: uid,
      busLines: [],
      buses: {},
    })
  );

  // Link company to admin profile in /admins/{uid}/companyIds
  const adminSnap = await get(ref(rtdb, `admins/${uid}/companyIds`));
  const existingIds: string[] = Array.isArray(adminSnap.val()) ? adminSnap.val() : [];
  if (!existingIds.includes(companyId)) {
    await set(ref(rtdb, `admins/${uid}/companyIds`), [...existingIds, companyId]);
  }

  return newCompany;
}

/**
 * Updates an existing company's fields in RTDB.
 */
export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  const compRef = ref(rtdb, `companies/${id}`);
  const snap = await get(compRef);
  if (!snap.exists()) throw new Error(`Company '${id}' not found in database.`);

  const existing = snap.val() as Company;
  const updatedCompany: Company = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Deep-stripped: RTDB rejects `undefined` anywhere (e.g. logoUrl: undefined
  // when no logo was chosen, or nested theme.presetId on generated themes).
  await update(
    compRef,
    stripUndefined({
      ...updates,
      updatedAt: updatedCompany.updatedAt,
    })
  );
  return updatedCompany;
}
