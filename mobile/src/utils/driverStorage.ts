import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPANY_KEY = 'driver_company_id_v1';
const BUSLINE_KEY = 'driver_bus_line_v1';

/**
 * Persists the assigned operating company ID into local AsyncStorage.
 */
export async function setDriverCompanyId(companyId: string): Promise<void> {
  await AsyncStorage.setItem(COMPANY_KEY, companyId);
}

/**
 * Retrieves the stored operating company ID from local AsyncStorage.
 */
export async function getDriverCompanyId(): Promise<string | null> {
  return AsyncStorage.getItem(COMPANY_KEY);
}

/**
 * Persists the assigned bus line ID into local AsyncStorage.
 */
export async function setDriverBusLine(busLine: string): Promise<void> {
  await AsyncStorage.setItem(BUSLINE_KEY, busLine);
}

/**
 * Retrieves the stored bus line ID from local AsyncStorage.
 */
export async function getDriverBusLine(): Promise<string | null> {
  return AsyncStorage.getItem(BUSLINE_KEY);
}

/**
 * Clears stored driver company and line session credentials.
 */
export async function clearDriverSession(): Promise<void> {
  await AsyncStorage.multiRemove([COMPANY_KEY, BUSLINE_KEY]);
}



