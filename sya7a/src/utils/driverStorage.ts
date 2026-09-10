import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPANY_KEY = 'driver_company_id_v1';
const BUSLINE_KEY = 'driver_bus_line_v1';

export async function setDriverCompanyId(companyId: string): Promise<void> {
  await AsyncStorage.setItem(COMPANY_KEY, companyId);
}

export async function getDriverCompanyId(): Promise<string | null> {
  return AsyncStorage.getItem(COMPANY_KEY);
}

export async function setDriverBusLine(busLine: string): Promise<void> {
  await AsyncStorage.setItem(BUSLINE_KEY, busLine);
}

export async function getDriverBusLine(): Promise<string | null> {
  return AsyncStorage.getItem(BUSLINE_KEY);
}

export async function clearDriverSession(): Promise<void> {
  await AsyncStorage.multiRemove([COMPANY_KEY, BUSLINE_KEY]);
}



