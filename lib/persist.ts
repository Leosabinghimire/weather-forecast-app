"use client";

import type { AppStore } from "./store";
import { hydrate } from "./features/weather/weatherSlice";
import { hydratePrefs } from "./features/preferences/preferencesSlice";

const KEY = "weather-app:v1";

interface Persisted {
  weather?: ReturnType<AppStore["getState"]>["weather"];
  preferences?: ReturnType<AppStore["getState"]>["preferences"];
}

export const loadPersisted = (): Persisted | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
};

export const subscribePersist = (store: AppStore) => {
  if (typeof window === "undefined") return () => {};
  let prev = store.getState();
  return store.subscribe(() => {
    const next = store.getState();
    if (next.weather !== prev.weather || next.preferences !== prev.preferences) {
      prev = next;
      try {
        window.localStorage.setItem(
          KEY,
          JSON.stringify({ weather: next.weather, preferences: next.preferences })
        );
      } catch {
        /* ignore */
      }
    }
  });
};

export const rehydrateStore = (store: AppStore) => {
  const persisted = loadPersisted();
  if (!persisted) return;
  if (persisted.weather) store.dispatch(hydrate(persisted.weather));
  if (persisted.preferences) store.dispatch(hydratePrefs(persisted.preferences));
};
