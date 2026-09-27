import type { Units } from "@/types/weather";

export const tempUnit = (u: Units) => (u === "metric" ? "°C" : "°F");
export const windUnit = (u: Units) => (u === "metric" ? "m/s" : "mph");

export const fmtTemp = (t: number | undefined, u: Units) => {
  if (t === undefined || t === null || Number.isNaN(t)) return "—";
  return `${Math.round(t)}${tempUnit(u)}`;
};

export const fmtWind = (s: number | undefined, u: Units) => {
  if (s === undefined) return "—";
  return `${s.toFixed(1)} ${windUnit(u)}`;
};

export const fmtPressure = (p: number | undefined) =>
  p === undefined ? "—" : `${p} hPa`;

export const fmtVisibility = (m: number | undefined) => {
  if (m === undefined) return "—";
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${m} m`;
};

export const fmtPct = (n: number | undefined) =>
  n === undefined ? "—" : `${Math.round(n)}%`;

export const degreesToCompass = (deg: number) => {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
  ];
  return dirs[Math.round(deg / 22.5) % 16];
};

export const capitalize = (s: string) =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;

export const capitalizeWords = (s: string) =>
  s
    .split(" ")
    .map(capitalize)
    .join(" ");

/** Dew point via the Magnus formula; `temp` is in the active units. */
export const dewPoint = (temp: number, humidity: number, u: Units) => {
  const c = u === "metric" ? temp : ((temp - 32) * 5) / 9;
  const a = 17.62;
  const b = 243.12;
  const g = Math.log(Math.max(humidity, 1) / 100) + (a * c) / (b + c);
  const dp = (b * g) / (a - g);
  return u === "metric" ? dp : (dp * 9) / 5 + 32;
};
