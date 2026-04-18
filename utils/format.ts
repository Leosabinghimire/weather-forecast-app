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
