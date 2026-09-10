import { database } from '../config/firebase';
import { ref, push, get, update, remove } from 'firebase/database';

export interface HistoryItem {
  id: string;
  busLine: string;
  companyName: string;
  timestamp: string;
}

export const saveToHistory = async (userId: string, busLine: string, companyName: string) => {
  if (!userId || !busLine) return;

  try {
    const historyRef = ref(database, `users/${userId}/history`);
    const timestamp = new Date().toISOString();
    const snapshot = await get(historyRef);
    const historyData = snapshot.val() || {};

    const historyItems: HistoryItem[] = Object.keys(historyData).map((key) => ({
      id: key,
      busLine: historyData[key].busLine,
      companyName: historyData[key].companyName,
      timestamp: historyData[key].timestamp,
    }));

    const existing = historyItems.find((item) => item.busLine === busLine);
    if (existing) {
      await update(ref(database, `users/${userId}/history/${existing.id}`), {
        companyName,
        timestamp,
      });
    } else {
      await push(historyRef, { busLine, companyName, timestamp });
    }

    const nextSnapshot = await get(historyRef);
    const nextData = nextSnapshot.val();
    if (!nextData) return;

    const items = Object.keys(nextData).map((key) => ({
      id: key,
      timestamp: nextData[key].timestamp as string,
    }));
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (items.length > 20) {
      await Promise.all(
        items.slice(20).map((item) => remove(ref(database, `users/${userId}/history/${item.id}`)))
      );
    }
  } catch (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
};



