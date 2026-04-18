"use client";

import {
  Box,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text
} from "@mantine/core";
import type { AirPollutionResponse } from "@/types/weather";
import { aqiLabel } from "@/utils/weather";

interface Props {
  data?: AirPollutionResponse;
  isLoading: boolean;
}

const mantineColor = (color: string): string => {
  // Map Mantine color names to actual hex for gradient thumb
  const map: Record<string, string> = {
    teal: "#12B886",
    lime: "#94D82D",
    yellow: "#FAB005",
    orange: "#FD7E14",
    red: "#FA5252"
  };
  return map[color] ?? "#12B886";
};

export default function AirQuality({ data, isLoading }: Props) {
  const entry = data?.list?.[0];
  const aqi = entry?.main.aqi;
  const info = aqi ? aqiLabel[aqi] : null;

  const components: Array<{ key: keyof NonNullable<typeof entry>["components"]; label: string; unit: string }> = [
    { key: "pm2_5", label: "PM2.5", unit: "μg/m³" },
    { key: "pm10", label: "PM10", unit: "μg/m³" },
    { key: "o3", label: "O₃", unit: "μg/m³" },
    { key: "no2", label: "NO₂", unit: "μg/m³" },
    { key: "so2", label: "SO₂", unit: "μg/m³" },
    { key: "co", label: "CO", unit: "μg/m³" }
  ];

  return (
    <Box className="glass fade-in" p="lg">
      <Group justify="space-between" mb="sm">
        <Text c="white" fw={700} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>
          Air quality
        </Text>
        {info && (
          <Text
            fw={700}
            size="sm"
            c={mantineColor(info.color)}
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "2px 10px",
              borderRadius: 999
            }}
          >
            {info.label}
          </Text>
        )}
      </Group>

      {isLoading || !entry || !info ? (
        <>
          <Skeleton height={22} radius="xl" mb="md" />
          <SimpleGrid cols={{ base: 2, xs: 3 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={56} radius="md" />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <>
          <Stack gap={6} mb="md">
            <Group justify="space-between">
              <Text c="rgba(255,255,255,0.8)" size="xs">
                AQI {aqi} / 5
              </Text>
              <Text c="rgba(255,255,255,0.6)" size="xs">
                {info.description}
              </Text>
            </Group>
            <Progress
              value={(aqi! / 5) * 100}
              color={info.color}
              size="md"
              radius="xl"
              striped
              animated
            />
          </Stack>

          <SimpleGrid cols={{ base: 2, xs: 3 }} spacing="sm">
            {components.map((c) => (
              <Box
                key={c.key}
                p="xs"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)"
                }}
              >
                <Text c="rgba(255,255,255,0.65)" size="xs">
                  {c.label}
                </Text>
                <Text c="white" fw={700} size="sm">
                  {entry.components[c.key].toFixed(1)}{" "}
                  <Text span c="rgba(255,255,255,0.55)" size="xs">
                    {c.unit}
                  </Text>
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
