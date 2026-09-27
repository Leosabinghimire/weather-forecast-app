"use client";

import { Box, Group, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  FaBolt,
  FaDroplet,
  FaMask,
  FaPersonWalking,
  FaShirt,
  FaSmog,
  FaSnowflake,
  FaSun,
  FaUmbrella,
  FaWind
} from "react-icons/fa6";
import type {
  AirPollutionResponse,
  CurrentWeather,
  ForecastResponse,
  Units
} from "@/types/weather";
import { cityTime } from "@/utils/time";

interface Props {
  current?: CurrentWeather;
  forecast?: ForecastResponse;
  air?: AirPollutionResponse;
  units: Units;
  isLoading: boolean;
}

interface Tip {
  icon: React.ReactNode;
  color: string;
  title: string;
  body: string;
}

const buildTips = (
  current: CurrentWeather,
  forecast: ForecastResponse | undefined,
  air: AirPollutionResponse | undefined,
  units: Units
): Tip[] => {
  const tips: Tip[] = [];
  const toC = (t: number) => (units === "metric" ? t : ((t - 32) * 5) / 9);
  const toMs = (s: number) => (units === "metric" ? s : s * 0.44704);

  const feels = toC(current.main.feels_like);
  const wind = toMs(current.wind.gust ?? current.wind.speed);
  const main = current.weather[0].main.toLowerCase();
  const isDay = current.dt > current.sys.sunrise && current.dt < current.sys.sunset;

  // Rain in the next ~12 hours (4 × 3h slots)
  const upcoming = (forecast?.list ?? []).slice(0, 4);
  const wettest = upcoming.reduce<ForecastResponse["list"][number] | undefined>(
    (best, i) => (!best || i.pop > best.pop ? i : best),
    undefined
  );

  if (main === "thunderstorm") {
    tips.push({
      icon: <FaBolt size={16} />,
      color: "violet",
      title: "Thunderstorm nearby",
      body: "Stay indoors if you can and avoid open areas and tall trees."
    });
  }

  if (["rain", "drizzle"].includes(main) || (wettest && wettest.pop >= 0.5)) {
    const when =
      wettest && forecast
        ? ` around ${cityTime(wettest.dt, forecast.city.timezone).format("ha")}`
        : "";
    tips.push({
      icon: <FaUmbrella size={16} />,
      color: "blue",
      title: "Take an umbrella",
      body: wettest
        ? `${Math.round(wettest.pop * 100)}% chance of rain${when}.`
        : "It's raining right now."
    });
  }

  if (main === "snow" || feels <= 0) {
    tips.push({
      icon: <FaSnowflake size={16} />,
      color: "cyan",
      title: "Bundle up",
      body: "Freezing temperatures — wear a heavy coat, gloves and a hat."
    });
  } else if (feels <= 12) {
    tips.push({
      icon: <FaShirt size={16} />,
      color: "indigo",
      title: "Wear a jacket",
      body: "It feels chilly out, so a warm layer is a good idea."
    });
  } else if (feels >= 32) {
    tips.push({
      icon: <FaDroplet size={16} />,
      color: "orange",
      title: "Stay hydrated",
      body: "It's very hot. Drink plenty of water and avoid the midday sun."
    });
  }

  if (isDay && main === "clear") {
    tips.push({
      icon: <FaSun size={16} />,
      color: "yellow",
      title: "Sunscreen recommended",
      body: "Clear skies today. Protect your skin and wear sunglasses."
    });
  }

  if (wind >= 10) {
    tips.push({
      icon: <FaWind size={16} />,
      color: "teal",
      title: "Windy conditions",
      body: "Strong gusts expected. Secure loose items outdoors."
    });
  }

  if (current.visibility < 1000) {
    tips.push({
      icon: <FaSmog size={16} />,
      color: "gray",
      title: "Low visibility",
      body: "Fog or haze is reducing visibility. Drive carefully."
    });
  }

  const aqi = air?.list[0]?.main.aqi;
  if (aqi && aqi >= 4) {
    tips.push({
      icon: <FaMask size={16} />,
      color: "red",
      title: "Wear a mask outside",
      body: "Air quality is poor. Limit outdoor exercise."
    });
  } else if (aqi === 3) {
    tips.push({
      icon: <FaMask size={16} />,
      color: "yellow",
      title: "Moderate air quality",
      body: "Sensitive groups should reduce long outdoor activity."
    });
  }

  if (!tips.length) {
    tips.push({
      icon: <FaPersonWalking size={16} />,
      color: "green",
      title: "Great time to be outside",
      body: "Comfortable conditions — enjoy your day!"
    });
  }

  return tips.slice(0, 4);
};

export default function WeatherTips({ current, forecast, air, units, isLoading }: Props) {
  const tips = current ? buildTips(current, forecast, air, units) : [];

  return (
    <Box className="glass fade-in" p="lg">
      <Text c="white" fw={700} size="sm" tt="uppercase" mb="sm" style={{ letterSpacing: 1 }}>
        Today&apos;s tips
      </Text>
      {isLoading || !current ? (
        <Stack gap="sm">
          <Skeleton height={52} radius="md" />
          <Skeleton height={52} radius="md" />
        </Stack>
      ) : (
        <Stack gap="sm">
          {tips.map((t) => (
            <Group
              key={t.title}
              gap="sm"
              wrap="nowrap"
              align="flex-start"
              p="sm"
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <ThemeIcon size={32} radius="md" variant="light" color={t.color}>
                {t.icon}
              </ThemeIcon>
              <Stack gap={0}>
                <Text c="white" fw={600} size="sm">
                  {t.title}
                </Text>
                <Text c="rgba(255,255,255,0.65)" size="xs">
                  {t.body}
                </Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      )}
    </Box>
  );
}
