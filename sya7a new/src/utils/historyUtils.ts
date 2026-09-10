import { database } from '../config/firebase';
import { ref, push, onValue, off, remove } from 'firebase/database';

export interface HistoryItem {
  id: string;
  busLine: string;
  companyName: string;
  timestamp: string;
}

export const saveToHistory = async (userId: string, busLine: string, companyName: string) => {
  try {
    const historyRef = ref(database, `users/${userId}/history`);
    const newHistoryItem = {
      busLine,
      companyName,
      timestamp: new Date().toISOString(),
    };
    
    await push(historyRef, newHistoryItem);
    
    // Keep only last 20 items
    const historySnapshot = await new Promise((resolve) => {
      const unsubscribe = onValue(historyRef, (snapshot) => {
        unsubscribe();
        resolve(snapshot);
      });
    });
    
    const historyData = (historySnapshot as any).val();
    if (historyData) {
      const historyItems = Object.keys(historyData).map(key => ({
        id: key,
        ...historyData[key]
      }));
      
      // Sort by timestamp and keep only last 20
      historyItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (historyItems.length > 20) {
        const itemsToRemove = historyItems.slice(20);
        for (const item of itemsToRemove) {
          const itemRef = ref(database, `users/${userId}/history/${item.id}`);
          await remove(itemRef);
        }
      }
    }
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};



