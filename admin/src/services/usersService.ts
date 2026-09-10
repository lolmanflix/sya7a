import { ref, onValue, off, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { PassengerRecord, UserHistoryItem } from '../types';

/**
 * Subscribes to registered passengers and their ride history logs.
 */
export function subscribePassengers(callback: (passengers: PassengerRecord[]) => void) {
  const usersRef = ref(database, 'users');
  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const list: PassengerRecord[] = Object.keys(data).map((uid) => {
        const userObj = data[uid] || {};
        const rawHistory = userObj.history || {};
        const history: UserHistoryItem[] = Object.keys(rawHistory).map((hId) => ({
          id: hId,
          busLine: rawHistory[hId].busLine || 'Unknown Line',
          companyName: rawHistory[hId].companyName || 'Unknown Operator',
          timestamp: rawHistory[hId].timestamp || new Date().toISOString(),
        }));

        // Sort history by most recent first
        history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return {
          uid,
          email: userObj.email || '',
          displayName: userObj.displayName || '',
          role: userObj.role || 'PASSENGER',
          createdAt: userObj.createdAt,
          lastSignIn: userObj.lastSignIn,
          disabled: Boolean(userObj.disabled),
          historyCount: history.length,
          history,
        };
      });

      // Sort: users with trip history first, then by email/displayName
      list.sort((a, b) => {
        if (b.historyCount !== a.historyCount) {
          return b.historyCount - a.historyCount;
        }
        return (a.email || a.displayName || '').localeCompare(b.email || b.displayName || '');
      });
      callback(list);
    },
    (err) => {
      console.error('Error fetching passengers:', err);
      callback([]);
    }
  );

  return () => off(usersRef, 'value', unsubscribe);
}

/**
 * Clears passenger trip history logs from RTDB.
 */
export async function clearPassengerHistory(uid: string): Promise<void> {
  const historyRef = ref(database, `users/${uid}/history`);
  await remove(historyRef);
}

/**
 * Removes a user record from RTDB.
 */
export async function deleteUserFromRTDB(uid: string): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  await remove(userRef);
}

