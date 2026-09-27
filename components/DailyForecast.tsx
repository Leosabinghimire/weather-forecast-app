"use client";

import { Box, Group, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { cityTime } from "@/utils/time";
import dayjs from "dayjs";
import Image from "next/image";
import type { ForecastResponse, Units, WeatherCondition } from "@/types/weather";
import { fmtTemp } from "@/utils/format";
import { iconUrl } from "@/utils/weather";

interface Props {
  data?: ForecastResponse;
  units: Units;
  isLoading: boolean;
}

interface DailyBucket {
  date: string;
  dayLabel: string;
  min: number;
  max: number;
  condition: WeatherCondition;
  pop: number;
}

const buildDaily = (data: ForecastResponse): DailyBucket[] => {
  const buckets = new Map<
    string,
    { temps: number[]; items: ForecastResponse["list"]; pops: number[] }
  >();

  const tz = data.city.timezone;
  data.list.forEach((item) => {
    const key = cityTime(item.dt, tz).format("YYYY-MM-DD");
    const b = buckets.get(key) ?? { temps: [], items: [], pops: [] };
    b.temps.push(item.main.temp);
    b.items.push(item);
    b.pops.push(item.pop);
    buckets.set(key, b);
  });

  return Array.from(buckets.entries())
    .slice(0, 5)
    .map(([key, b], idx) => {
      // Pick the item closest to 12:00 local as the "representative" condition
      const midday =
        b.items.find((i) => cityTime(i.dt, tz).hour() >= 12) ?? b.items[0];
      return {
        date: key,
        dayLabel: idx === 0 ? "Today" : dayjs(key).format("ddd"),
        min: Math.min(...b.temps),
        max: Math.max(...b.temps),
        condition: midday.weather[0],
        pop: Math.max(...b.pops)
      };
    });
};

export default function DailyForecast({ data, units, isLoading }: Props) {
  const daily = data ? buildDaily(data) : [];
  // Shared scale so the range bars are comparable across days
  const lo = Math.min(...daily.map((d) => d.min));
  const hi = Math.max(...daily.map((d) => d.max));
  const span = Math.max(hi - lo, 1);

  return (
    <Box className="glass fade-in" p="lg">
      <Text c="white" fw={700} size="sm" tt="uppercase" mb="sm" style={{ letterSpacing: 1 }}>
        5-day forecast
      </Text>
      <SimpleGrid cols={{ base: 2, xs: 3, sm: 5 }} spacing="sm">
        {isLoading || !data
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={150} radius="md" />
            ))
          : daily.map((d) => (
              <Stack
                key={d.date}
                p="sm"
                gap={4}
                align="center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >
                <Text c="white" fw={600} size="sm">
                  {d.dayLabel}
                </Text>
                <Image
                  src={iconUrl(d.condition.icon, 2)}
                  alt={d.condition.description}
                  width={64}
                  height={64}
                  unoptimized
                />
                <Group gap={6}>
                  <Text c="white" fw={700}>
                    {fmtTemp(d.max, units)}
                  </Text>
                  <Text c="rgba(255,255,255,0.65)" fw={500}>
                    {fmtTemp(d.min, units)}
                  </Text>
                </Group>
                <Box
                  w="100%"
                  h={6}
                  my={4}
                  pos="relative"
                  style={{ borderRadius: 3, background: "rgba(255,255,255,0.1)" }}
                >
                  <Box
                    pos="absolute"
                    top={0}
                    bottom={0}
                    style={{
                      left: `${((d.min - lo) / span) * 100}%`,
                      right: `${((hi - d.max) / span) * 100}%`,
                      minWidth: 6,
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #4DABF7, #FFD43B, #FF922B)"
                    }}
                  />
                </Box>
                <Text c="rgba(255,255,255,0.7)" size="xs" ta="center" lineClamp={1} tt="capitalize">
                  {d.condition.description}
                </Text>
                <Text c="rgba(255,255,255,0.7)" size="xs">
                  💧 {Math.round(d.pop * 100)}%
                </Text>
              </Stack>
            ))}
      </SimpleGrid>
    </Box>
  );
}
