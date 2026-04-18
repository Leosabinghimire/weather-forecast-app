# Atmos Weather

A polished, production-grade weather dashboard built from scratch with **Next.js 14 (App Router)**, **TypeScript**, **Mantine UI v7**, **Redux Toolkit + RTK Query**, and the **OpenWeatherMap API**. Atmos turns a raw meteorology feed into a calm, glanceable experience: a single screen that tells you what the weather is right now, what it will do next, how clean the air is, and when the sun will set — all wrapped in a mood-aware, animated background that shifts with the conditions.

---

## Project description

Atmos Weather is a fully client-rendered dashboard that blends five OpenWeatherMap endpoints (geocoding, reverse geocoding, current conditions, 5-day / 3-hour forecast, air pollution) into a single coherent interface. The goal was not "another weather app" — it was to build a UI that feels designed: a glassmorphism layout, fluid responsive grid, dynamic backgrounds that respond to weather and time of day, and thoughtful state management that remembers what you care about (favorite cities, recent searches, units, color scheme) across visits.

Every widget is driven by cached RTK Query hooks, so switching cities is instant after the first fetch, and a refresh button lets the user invalidate all three queries at once. Preferences and saved cities are persisted to `localStorage` via a tiny rehydration bootstrap that runs on the client before the store is exposed to the React tree.

---

## Features

### Core dashboard
- **Current conditions card** — large temperature readout, feels-like, description, high / low, icon, and location label with country flag-style code.
- **Dynamic, mood-aware animated background** — resolves from the current weather code, temperature, and whether it's day or night into one of: `clear-day`, `clear-night`, `cloudy`, `rain`, `storm`, `snow`, `hot`, or `cold`. Gradients, particles, and blur intensity adapt accordingly.
- **Weather details grid** — humidity, pressure, wind speed + direction, visibility, cloud cover, and dew point with sensible units.
- **Hourly forecast** — interactive chart (Mantine Charts / Recharts) showing the next 24–48 hours of temperature with tooltips and scrollable time axis.
- **Precipitation chart** — bar chart of upcoming rain / snow volume (mm) so the user can see at a glance when the next shower is due.
- **5-day daily forecast** — aggregated from OpenWeather's 3-hour endpoint: high / low, dominant icon, and description per day.
- **Air Quality Index card** — AQI score (Good → Very Poor) with per-pollutant breakdown (CO, NO, NO₂, O₃, SO₂, PM2.5, PM10, NH₃) and color-coded badge.
- **Animated sunrise / sunset arc** — SVG arc with the live sun position computed from the current time between sunrise and sunset, plus day-length readout.

### Search & location
- **Debounced city autocomplete** — 350 ms debounce against the OpenWeather Geocoding API, showing up to 5 matches with state and country.
- **One-click geolocation** — uses the browser's `navigator.geolocation` then reverse-geocodes the coordinates for a readable name.
- **Favorites drawer** — pin cities with one click, reorder is implicit by recency, remove inline.
- **Recent searches** — automatically tracked; the drawer shows both favorites and history.

### UX polish
- **°C / °F toggle** — switches units globally and re-queries the API.
- **Light / dark color scheme** — Mantine color scheme wired to Redux and persisted.
- **Loading skeletons** — every card has its own skeleton state so the layout never jumps.
- **Toast notifications** — friendly error messages via `@mantine/notifications` when the API fails.
- **Empty state** — onboarding card prompts the user to search or use geolocation on first visit.
- **Mobile-first responsive layout** — collapses from a 2-column desktop grid to a single stacked column on small screens.

---

## Tech stack

| Layer                | Choice                                                      |
| -------------------- | ----------------------------------------------------------- |
| Framework            | Next.js 14.2 (App Router, client components)                |
| Language             | TypeScript 5.6 (strict)                                     |
| UI library           | Mantine UI v7 (`@mantine/core`, `@mantine/hooks`)           |
| Charts               | `@mantine/charts` + Recharts 2.13                           |
| Notifications        | `@mantine/notifications`                                    |
| State / data fetching| Redux Toolkit 2.3 + RTK Query                               |
| Icons                | `react-icons`                                               |
| Date / time          | Day.js                                                      |
| Styling              | Mantine + PostCSS (`postcss-preset-mantine`) + global CSS   |
| Data source          | OpenWeatherMap (Geocoding, Weather, Forecast, Air Pollution)|

---

## Getting started

```bash
cd weather-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Add your OpenWeatherMap API key to `.env.local`:

```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
```

### Scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm start` — run the built output
- `npm run lint` — ESLint

---

## Architecture

```
weather-app/
├── app/                        # Next.js App Router entry
│   ├── layout.tsx              # HTML shell, Mantine ColorSchemeScript, providers
│   ├── page.tsx                # Dashboard route
│   ├── providers.tsx           # MantineProvider + Redux Provider + localStorage rehydration
│   └── globals.css             # Global tokens, glassmorphism helpers, keyframes
│
├── components/                 # All UI (presentational + container)
│   ├── WeatherDashboard.tsx    # Orchestrates queries, grid layout, mood resolution
│   ├── HeaderBar.tsx           # Brand, unit toggle, color-scheme toggle
│   ├── SearchBar.tsx           # Debounced autocomplete + geolocation button
│   ├── CurrentWeather.tsx      # Hero card with refresh control
│   ├── WeatherDetails.tsx      # Humidity / pressure / wind / visibility grid
│   ├── HourlyForecast.tsx      # 24–48h temperature line chart
│   ├── PrecipitationChart.tsx  # Upcoming rain / snow bar chart
│   ├── DailyForecast.tsx       # 5-day aggregated cards
│   ├── AirQuality.tsx          # AQI badge + pollutant breakdown
│   ├── SunTimes.tsx            # Animated sunrise / sunset arc
│   ├── SavedCities.tsx         # Favorites + recent-searches drawer
│   ├── WeatherBackground.tsx   # Mood-driven animated gradient layer
│   └── EmptyState.tsx          # First-visit onboarding card
│
├── lib/
│   ├── store.ts                # Redux store, RTK Query middleware wiring
│   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   ├── persist.ts              # localStorage serialize + rehydrate bootstrap
│   └── features/
│       ├── weather/
│       │   ├── weatherApi.ts   # RTK Query endpoints (5)
│       │   └── weatherSlice.ts # Active city, favorites, recent searches
│       └── preferences/
│           └── preferencesSlice.ts  # Units + color scheme
│
├── types/
│   └── weather.ts              # Typed OpenWeather response shapes
│
├── utils/
│   ├── format.ts               # Temperature, wind, time, AQI formatters
│   └── weather.ts              # `resolveMood()` + daily aggregation helpers
│
├── public/                     # Static assets
├── next.config.mjs
├── postcss.config.cjs
├── tsconfig.json
└── package.json
```

### Data flow

1. The user searches or triggers geolocation → `SearchBar` dispatches `setActive()` on the weather slice with `{ name, lat, lon, country, state }`.
2. `WeatherDashboard` reads the active city and units, then fires three RTK Query hooks in parallel: `useCurrentWeatherQuery`, `useForecastQuery`, `useAirPollutionQuery`.
3. RTK Query caches responses for 5 minutes (`keepUnusedDataFor: 300`); switching back to a recently viewed city is served from cache.
4. The current-weather response feeds `resolveMood()`, which classifies conditions into a background mood; `WeatherBackground` animates accordingly.
5. Changes to favorites / recents / units / color scheme are written through to `localStorage` via a subscribe loop in `persist.ts`; on next load, `providers.tsx` rehydrates the store before rendering.

---

## OpenWeatherMap endpoints used

| Endpoint                      | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `/geo/1.0/direct`             | City autocomplete                        |
| `/geo/1.0/reverse`            | Name lookup from geolocation coordinates |
| `/data/2.5/weather`           | Current conditions                       |
| `/data/2.5/forecast`          | 5-day / 3-hour forecast                  |
| `/data/2.5/air_pollution`     | AQI and pollutant concentrations         |

---

## Credits

Weather data © [OpenWeatherMap](https://openweathermap.org/). Built with Next.js, Mantine UI, and Redux Toolkit.
