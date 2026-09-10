import { database } from '../config/firebase';
import { ref, onValue, off, set, remove } from 'firebase/database';

export type Unsubscribe = () => void;

export function listenToFavorites(userId: string, onChange: (lines: Set<string>) => void): Unsubscribe {
  const favRef = ref(database, `users/${userId}/favorites`);
  const unsubscribe = onValue(favRef, (snapshot) => {
    const data = snapshot.val();
    const setLines = new Set<string>();
    if (data) {
      Object.keys(data).forEach((line) => {
        if (data[line]) setLines.add(line);
      });
    }
    onChange(setLines);
  });
  return () => off(favRef, 'value', unsubscribe);
}

export async function addFavorite(userId: string, lineName: string): Promise<void> {
  await set(ref(database, `users/${userId}/favorites/${lineName}`), true);
}

export async function removeFavorite(userId: string, lineName: string): Promise<void> {
  await remove(ref(database, `users/${userId}/favorites/${lineName}`));
}

export async function toggleFavorite(userId: string, lineName: string, isFavorite: boolean): Promise<void> {
  if (isFavorite) {
    await removeFavorite(userId, lineName);
  } else {
    await addFavorite(userId, lineName);
  }
}



