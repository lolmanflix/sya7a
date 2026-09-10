import { ref, get, set, remove, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { CompanyRecord } from '../types';

/**
 * Subscribes to real-time company directory updates from Firebase.
 */
export function subscribeCompanies(callback: (companies: CompanyRecord[]) => void) {
  const companiesRef = ref(database, 'companies');
  const unsubscribe = onValue(
    companiesRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const list: CompanyRecord[] = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name || key.toUpperCase(),
        nameAr: data[key].nameAr,
        domain: data[key].domain || null,
        busLines: Array.isArray(data[key].busLines) ? data[key].busLines : [],
        buses: data[key].buses || {},
      }));
      callback(list);
    },
    (error) => {
      console.error('Error fetching companies:', error);
      callback([]);
    }
  );

  return () => off(companiesRef, 'value', unsubscribe);
}

/**
 * Creates or updates a transit company record.
 */
export async function saveCompany(companyId: string, data: Partial<CompanyRecord>): Promise<void> {
  const compRef = ref(database, `companies/${companyId.trim().toLowerCase()}`);
  const snapshot = await get(compRef);
  const existing = snapshot.val() || {};

  await set(compRef, {
    ...existing,
    name: data.name ?? existing.name ?? companyId,
    domain: data.domain !== undefined ? data.domain : (existing.domain ?? null),
    busLines: data.busLines ?? existing.busLines ?? [],
  });
}

/**
 * Updates the busLines array for a given company.
 */
export async function updateCompanyLines(companyId: string, lines: string[]): Promise<void> {
  const linesRef = ref(database, `companies/${companyId}/busLines`);
  await set(linesRef, lines);
}

/**
 * Directly appends a new bus line to a company's busLines array in Firebase RTDB.
 */
export async function addCompanyLine(companyId: string, lineName: string): Promise<void> {
  const cleanLine = lineName.trim();
  if (!cleanLine) return;
  const linesRef = ref(database, `companies/${companyId}/busLines`);
  const snap = await get(linesRef);
  const currentLines: string[] = Array.isArray(snap.val()) ? snap.val() : [];
  if (!currentLines.includes(cleanLine)) {
    currentLines.push(cleanLine);
    await set(linesRef, currentLines);
  }
}

/**
 * Renames a bus line and cascades the update to all assigned buses.
 */
export async function renameCompanyLine(
  companyId: string,
  oldLine: string,
  newLine: string
): Promise<void> {
  const compRef = ref(database, `companies/${companyId}`);
  const snap = await get(compRef);
  const comp = snap.val();
  if (!comp) return;

  const lines: string[] = Array.isArray(comp.busLines) ? comp.busLines : [];
  const updatedLines = lines.map((l) => (l === oldLine ? newLine : l));
  await set(ref(database, `companies/${companyId}/busLines`), updatedLines);

  // Cascade to buses under this company
  if (comp.buses && typeof comp.buses === 'object') {
    for (const busId of Object.keys(comp.buses)) {
      if (comp.buses[busId]?.lineId === oldLine) {
        await set(ref(database, `companies/${companyId}/buses/${busId}/lineId`), newLine);
      }
    }
  }
}

/**
 * Deletes a bus line from a company.
 */
export async function deleteCompanyLine(companyId: string, lineToDelete: string): Promise<void> {
  const linesRef = ref(database, `companies/${companyId}/busLines`);
  const snap = await get(linesRef);
  const lines: string[] = snap.val() || [];
  const filtered = lines.filter((l) => l !== lineToDelete);
  await set(linesRef, filtered);
}

/**
 * Safely removes a company key.
 */
export async function removeCompany(companyId: string): Promise<void> {
  const compRef = ref(database, `companies/${companyId}`);
  await remove(compRef);
}
