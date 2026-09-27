"use client";

import {
  Box,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon
} from "@mantine/core";
import {
  FaCloud,
  FaDroplet,
  FaEye,
  FaGauge,
  FaTemperatureHalf,
  FaWind
} from "react-icons/fa6";
import type { CurrentWeather, Units } from "@/types/weather";
import {
  degreesToCompass,
  dewPoint,
  fmtPct,
  fmtPressure,
  fmtTemp,
  fmtVisibility,
  fmtWind
} from "@/utils/format";

interface Props {
  data?: CurrentWeather;
  units: Units;
  isLoading: boolean;
}

interface Metric {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

export default function WeatherDetails({ data, units, isLoading }: Props) {
  const metrics: Metric[] = data
    ? [
        {
          label: "Feels like",
          value: fmtTemp(data.main.feels_like, units),
          icon: <FaTemperatureHalf size={18} />,
          color: "orange"
        },
        {
          label: "Humidity",
          value: fmtPct(data.main.humidity),
          sub: `Dew point ${fmtTemp(dewPoint(data.main.temp, data.main.humidity, units), units)}`,
          icon: <FaDroplet size={18} />,
          color: "blue"
        },
        {
          label: "Wind",
          value: fmtWind(data.wind.speed, units),
          sub: `${degreesToCompass(data.wind.deg)} · ${data.wind.deg}°${
            data.wind.gust ? ` · gusts ${fmtWind(data.wind.gust, units)}` : ""
          }`,
          icon: <FaWind size={18} />,
          color: "teal"
        },
        {
          label: "Pressure",
          value: fmtPressure(data.main.pressure),
          icon: <FaGauge size={18} />,
          color: "grape"
        },
        {
          label: "Visibility",
          value: fmtVisibility(data.visibility),
          icon: <FaEye size={18} />,
          color: "cyan"
        },
        {
          label: "Cloudiness",
          value: fmtPct(data.clouds.all),
          icon: <FaCloud size={18} />,
          color: "gray"
        }
      ]
    : [];

  return (
    <Box className="glass fade-in" p="lg">
      <Text c="white" fw={700} size="sm" tt="uppercase" mb="sm" style={{ letterSpacing: 1 }}>
        Conditions
      </Text>
      <SimpleGrid cols={{ base: 2, xs: 3 }} spacing="md">
        {isLoading || !data
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={80} radius="md" />
            ))
          : metrics.map((m) => (
              <Box
                key={m.label}
                p="sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >
                <Group gap="xs" mb={6}>
                  <ThemeIcon
                    size="sm"
                    radius="xl"
                    variant="light"
                    color={m.color}
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {m.icon}
                  </ThemeIcon>
                  <Text c="rgba(255,255,255,0.75)" size="xs" fw={600}>
                    {m.label}
                  </Text>
                </Group>
                <Stack gap={0}>
                  <Text c="white" fw={700} size="lg" lh={1.1}>
                    {m.value}
                  </Text>
                  {m.sub && (
                    <Text c="rgba(255,255,255,0.6)" size="xs">
                      {m.sub}
                    </Text>
                  )}
                </Stack>
              </Box>
            ))}
      </SimpleGrid>
    </Box>
  );
}
