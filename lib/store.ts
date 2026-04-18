import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { weatherApi } from "./features/weather/weatherApi";
import weatherReducer from "./features/weather/weatherSlice";
import preferencesReducer from "./features/preferences/preferencesSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      weather: weatherReducer,
      preferences: preferencesReducer,
      [weatherApi.reducerPath]: weatherApi.reducer
    },
    middleware: (getDefault) => getDefault().concat(weatherApi.middleware)
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();
setupListeners(store.dispatch);
