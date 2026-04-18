import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Units } from "@/types/weather";

export type ColorScheme = "light" | "dark" | "auto";

interface PreferencesState {
  units: Units;
  colorScheme: ColorScheme;
}

const initialState: PreferencesState = {
  units: "metric",
  colorScheme: "dark"
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setUnits(state, action: PayloadAction<Units>) {
      state.units = action.payload;
    },
    toggleUnits(state) {
      state.units = state.units === "metric" ? "imperial" : "metric";
    },
    setColorScheme(state, action: PayloadAction<ColorScheme>) {
      state.colorScheme = action.payload;
    },
    hydratePrefs(state, action: PayloadAction<Partial<PreferencesState>>) {
      if (action.payload.units) state.units = action.payload.units;
      if (action.payload.colorScheme) state.colorScheme = action.payload.colorScheme;
    }
  }
});

export const { setUnits, toggleUnits, setColorScheme, hydratePrefs } =
  preferencesSlice.actions;

export default preferencesSlice.reducer;
