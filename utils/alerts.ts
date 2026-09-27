import type {
  AirPollutionResponse,
  CurrentWeather,
  ForecastResponse,
  Units
} from "@/types/weather";
import { cityTime } from "./time";

export type AlertSeverity = "warning" | "advisory";

export interface WeatherAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
}

/**
 * Derives alerts from the free forecast data (next 24 hours).
 * These are not official warnings — OpenWeather's official alerts require
 * the paid One Call 3.0 plan.
 */
export const buildAlerts = (
  current: CurrentWeather | undefined,
  forecast: ForecastResponse | undefined,
  air: AirPollutionResponse | undefined,
  units: Units
): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  if (!current) return alerts;

  const toC = (t: number) => (units === "metric" ? t : ((t - 32) * 5) / 9);
  const toMs = (s: number) => (units === "metric" ? s : s * 0.44704);
  const tz = forecast?.city.timezone ?? current.timezone;
  const at = (dt: number) => cityTime(dt, tz).format("ddd ha");

  const next24 = (forecast?.list ?? []).slice(0, 8);

  // Thunderstorms (condition ids 2xx)
  const storm = next24.find((i) => Math.floor(i.weather[0].id / 100) === 2);
  if (Math.floor(current.weather[0].id / 100) === 2 || storm) {
    alerts.push({
      id: "thunderstorm",
      severity: "warning",
      title: "Thunderstorm alert",
      message: storm
        ? `Thunderstorms expected around ${at(storm.dt)}. Stay indoors and avoid open areas.`
        : "Thunderstorm in progress. Stay indoors and avoid open areas."
    });
  }

  // Heavy rain — per 3h slot and 24h total
  const rainOf = (i: (typeof next24)[number]) => i.rain?.["3h"] ?? 0;
  const wettest = next24.reduce<(typeof next24)[number] | undefined>(
    (best, i) => (!best || rainOf(i) > rainOf(best) ? i : best),
    undefined
  );
  const totalRain = next24.reduce((sum, i) => sum + rainOf(i), 0);
  if (wettest && (rainOf(wettest) >= 10 || totalRain >= 30)) {
    alerts.push({
      id: "heavy-rain",
      severity: "warning",
      title: "Heavy rain alert",
      message: `About ${totalRain.toFixed(0)} mm of rain in the next 24 hours, heaviest around ${at(
        wettest.dt
      )}. Watch for flooding and landslides.`
    });
  } else if (wettest && (rainOf(wettest) >= 5 || totalRain >= 15)) {
    alerts.push({
      id: "heavy-rain",
      severity: "advisory",
      title: "Moderate to heavy rain",
      message: `About ${totalRain.toFixed(0)} mm of rain in the next 24 hours, heaviest around ${at(
        wettest.dt
      )}.`
    });
  }

  // Snow (condition ids 6xx)
  const snow = next24.find((i) => Math.floor(i.weather[0].id / 100) === 6 && (i.snow?.["3h"] ?? 0) >= 2);
  if (snow) {
    alerts.push({
      id: "snow",
      severity: "advisory",
      title: "Snowfall expected",
      message: `Snow expected around ${at(snow.dt)}. Roads may be slippery.`
    });
  }

  // Wind gusts
  const maxGust = Math.max(
    toMs(current.wind.gust ?? current.wind.speed),
    ...next24.map((i) => toMs(i.wind.gust ?? i.wind.speed))
  );
  if (maxGust >= 17) {
    alerts.push({
      id: "wind",
      severity: "warning",
      title: "High wind alert",
      message: `Gusts up to ${Math.round(maxGust * 3.6)} km/h. Secure loose objects and take care outdoors.`
    });
  } else if (maxGust >= 12) {
    alerts.push({
      id: "wind",
      severity: "advisory",
      title: "Strong winds",
      message: `Gusts up to ${Math.round(maxGust * 3.6)} km/h expected.`
    });
  }

  // Temperature extremes
  const feels = [current.main.feels_like, ...next24.map((i) => i.main.feels_like)].map(toC);
  const hottest = Math.max(...feels);
  const coldest = Math.min(...feels);
  if (hottest >= 38) {
    alerts.push({
      id: "heat",
      severity: "warning",
      title: "Extreme heat",
      message: `Feels like up to ${Math.round(hottest)}°C. Avoid the midday sun and drink plenty of water.`
    });
  } else if (hottest >= 35) {
    alerts.push({
      id: "heat",
      severity: "advisory",
      title: "Heat advisory",
      message: `Feels like up to ${Math.round(hottest)}°C. Stay hydrated.`
    });
  }
  if (coldest <= -10) {
    alerts.push({
      id: "cold",
      severity: "warning",
      title: "Extreme cold",
      message: `Feels like down to ${Math.round(coldest)}°C. Risk of frostbite — dress in layers.`
    });
  }

  // Dense fog
  if (current.visibility < 500) {
    alerts.push({
      id: "fog",
      severity: "advisory",
      title: "Dense fog",
      message: `Visibility is ${current.visibility} m. Drive slowly and use low-beam lights.`
    });
  }

  // Air quality
  const aqi = air?.list[0]?.main.aqi;
  if (aqi === 5) {
    alerts.push({
      id: "aqi",
      severity: "warning",
      title: "Very poor air quality",
      message: "Avoid outdoor activity and wear a mask (N95) if you must go out."
    });
  } else if (aqi === 4) {
    alerts.push({
      id: "aqi",
      severity: "advisory",
      title: "Poor air quality",
      message: "Limit time outdoors, especially children, older adults and people with asthma."
    });
  }

  // Warnings first
  return alerts.sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === "warning" ? -1 : 1
  );
};
