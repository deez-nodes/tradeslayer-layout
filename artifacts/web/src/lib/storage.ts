/**
 * Tiny JSON persistence over localStorage. Local-first by design — this is the
 * seam where a real API client could later back the same interface. Async
 * signatures are kept (even though localStorage is sync) so consumers like
 * SessionContext hydrate the same way they did on native AsyncStorage.
 *
 * Note: localStorage is quota-limited and cleared by private/incognito modes;
 * swap to an IndexedDB adapter here if durable multi-day history is required.
 */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best-effort: ignore quota/serialization failures rather than crash the UI.
  }
}
