import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Tiny JSON persistence over AsyncStorage. On native this is the platform
 * key-value store; on web it shims to localStorage. Local-first by design —
 * this is the seam where a generated API client could later back the same
 * interface (see the completion roadmap). Note: on web, localStorage is
 * quota-limited and cleared by private/incognito modes; swap to an IndexedDB
 * adapter here if durable multi-day history becomes a hard requirement.
 */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best-effort: ignore quota/serialization failures rather than crash the UI.
  }
}
