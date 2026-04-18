"use client";

import { Box, Group, Skeleton, Stack, Text } from "@mantine/core";
import { WiSunrise, WiSunset } from "react-icons/wi";
import dayjs from "dayjs";
import type { CurrentWeather } from "@/types/weather";

interface Props {
  data?: CurrentWeather;
  isLoading: boolean;
}

export default function SunTimes({ data, isLoading }: Props) {
  const now = data ? dayjs.unix(data.dt) : dayjs();
  const sunrise = data ? dayjs.unix(data.sys.sunrise) : null;
  const sunset = data ? dayjs.unix(data.sys.sunset) : null;

  let progress = 0;
  if (sunrise && sunset) {
    const total = sunset.diff(sunrise);
    const elapsed = now.diff(sunrise);
    progress = Math.max(0, Math.min(1, elapsed / total));
  }

  return (
    <Box className="glass fade-in" p="lg">
      <Text c="white" fw={700} size="sm" tt="uppercase" mb="sm" style={{ letterSpacing: 1 }}>
        Sun
      </Text>

      {isLoading || !data ? (
        <Skeleton height={140} radius="md" />
      ) : (
        <>
          <Box
            style={{
              position: "relative",
              height: 110,
              marginTop: 8,
              marginBottom: 12
            }}
          >
            <svg viewBox="0 0 200 90" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="arc" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#FAB005" />
                  <stop offset="50%" stopColor="#FF922B" />
                  <stop offset="100%" stopColor="#FA5252" />
                </linearGradient>
              </defs>
              <path
                d="M 10 85 A 90 90 0 0 1 190 85"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 10 85 A 90 90 0 0 1 190 85"
                fill="none"
                stroke="url(#arc)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={(1 - progress) * 283}
              />
              <circle
                cx={10 + 180 * progress}
                cy={85 - Math.sin(Math.PI * progress) * 75}
                r={6}
                fill="#FFD43B"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </Box>

          <Group justify="space-between">
            <Stack gap={0}>
              <Group gap={6}>
                <WiSunrise size={22} color="#FAB005" />
                <Text size="xs" c="rgba(255,255,255,0.7)">
                  Sunrise
                </Text>
              </Group>
              <Text c="white" fw={700}>
                {sunrise?.format("h:mm A")}
              </Text>
            </Stack>
            <Stack gap={0} align="flex-end">
              <Group gap={6}>
                <Text size="xs" c="rgba(255,255,255,0.7)">
                  Sunset
                </Text>
                <WiSunset size={22} color="#FA5252" />
              </Group>
              <Text c="white" fw={700}>
                {sunset?.format("h:mm A")}
              </Text>
            </Stack>
          </Group>
        </>
      )}
    </Box>
  );
}
