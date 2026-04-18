import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AirPollutionResponse,
  CurrentWeather,
  ForecastResponse,
  GeoLocation,
  Units,
} from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? "";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.openweathermap.org" }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    searchCities: builder.query<GeoLocation[], string>({
      query: (q) =>
        `/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`,
    }),
    reverseGeocode: builder.query<GeoLocation[], { lat: number; lon: number }>({
      query: ({ lat, lon }) =>
        `/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
    }),
    currentWeather: builder.query<
      CurrentWeather,
      { lat: number; lon: number; units: Units }
    >({
      query: ({ lat, lon, units }) =>
        `/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
    }),
    forecast: builder.query<
      ForecastResponse,
      { lat: number; lon: number; units: Units }
    >({
      query: ({ lat, lon, units }) =>
        `/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
    }),
    airPollution: builder.query<
      AirPollutionResponse,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) =>
        `/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    }),
  }),
});

export const {
  useSearchCitiesQuery,
  useLazySearchCitiesQuery,
  useReverseGeocodeQuery,
  useLazyReverseGeocodeQuery,
  useCurrentWeatherQuery,
  useForecastQuery,
  useAirPollutionQuery,
} = weatherApi;
