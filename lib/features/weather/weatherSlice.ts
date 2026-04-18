import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GeoLocation, SavedCity } from "@/types/weather";

export interface ActiveLocation {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface WeatherState {
  active: ActiveLocation | null;
  recent: SavedCity[];
  favorites: SavedCity[];
}

const toSavedCity = (g: GeoLocation | ActiveLocation): SavedCity => ({
  id: `${g.lat.toFixed(3)},${g.lon.toFixed(3)}`,
  name: g.name,
  country: g.country,
  state: (g as GeoLocation).state,
  lat: g.lat,
  lon: g.lon,
  addedAt: Date.now()
});

const initialState: WeatherState = {
  active: null,
  recent: [],
  favorites: []
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setActiveLocation(state, action: PayloadAction<ActiveLocation>) {
      state.active = action.payload;
      const saved = toSavedCity(action.payload);
      state.recent = [
        saved,
        ...state.recent.filter((c) => c.id !== saved.id)
      ].slice(0, 8);
    },
    clearActive(state) {
      state.active = null;
    },
    toggleFavorite(state, action: PayloadAction<ActiveLocation>) {
      const saved = toSavedCity(action.payload);
      const exists = state.favorites.some((c) => c.id === saved.id);
      if (exists) {
        state.favorites = state.favorites.filter((c) => c.id !== saved.id);
      } else {
        state.favorites = [saved, ...state.favorites].slice(0, 12);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter((c) => c.id !== action.payload);
    },
    removeRecent(state, action: PayloadAction<string>) {
      state.recent = state.recent.filter((c) => c.id !== action.payload);
    },
    clearRecent(state) {
      state.recent = [];
    },
    hydrate(state, action: PayloadAction<Partial<WeatherState>>) {
      if (action.payload.active !== undefined) state.active = action.payload.active;
      if (action.payload.recent) state.recent = action.payload.recent;
      if (action.payload.favorites) state.favorites = action.payload.favorites;
    }
  }
});

export const {
  setActiveLocation,
  clearActive,
  toggleFavorite,
  removeFavorite,
  removeRecent,
  clearRecent,
  hydrate
} = weatherSlice.actions;

export default weatherSlice.reducer;
