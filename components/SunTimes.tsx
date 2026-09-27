"use client";

import { useId } from "react";
import { Box, Group, Skeleton, Stack, Text } from "@mantine/core";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { cityTime, fmtDuration } from "@/utils/time";
import type { CurrentWeather } from "@/types/weather";

interface Props {
  data?: CurrentWeather;
  isLoading: boolean;
}

// Arc geometry (SVG user units)
const W = 240;
const CX = W / 2;
const CY = 112;
const R = 96;
const START_X = CX - R;
const END_X = CX + R;

export default function SunTimes({ data, isLoading }: Props) {
  const uid = useId().replace(/:/g, "");
  const tz = data?.timezone ?? 0;
  const now = data ? cityTime(data.dt, tz) : null;
  const sunrise = data ? cityTime(data.sys.sunrise, tz) : null;
  const sunset = data ? cityTime(data.sys.sunset, tz) : null;

  let progress = 0;
  let status = "";
  let dayLength = "";
  if (now && sunrise && sunset) {
    const total = sunset.diff(sunrise);
    progress = Math.max(0, Math.min(1, now.diff(sunrise) / total));
    dayLength = fmtDuration(total);
    if (now.isBefore(sunrise)) status = `Sunrise in ${fmtDuration(sunrise.diff(now))}`;
    else if (now.isAfter(sunset)) status = "Sun has set";
    else status = `${fmtDuration(sunset.diff(now))} of daylight left`;
  }

  const isDay = progress > 0 && progress < 1;
  const angle = Math.PI * (1 - progress);
  const sunX = CX + R * Math.cos(angle);
  const sunY = CY - R * Math.sin(angle);
  const arc = `M ${START_X} ${CY} A ${R} ${R} 0 0 1 ${END_X} ${CY}`;
  const traveled = `M ${START_X} ${CY} A ${R} ${R} 0 0 1 ${sunX} ${sunY}`;
  const traveledFill = `${traveled} L ${sunX} ${CY} Z`;

  return (
    <Box className="glass fade-in" p="lg">
      <Group justify="space-between" mb="xs">
        <Text c="white" fw={700} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>
          Sun
        </Text>
        {dayLength && (
          <Text size="xs" c="rgba(255,255,255,0.55)">
            Day length · {dayLength}
          </Text>
        )}
      </Group>

      {isLoading || !data ? (
        <Skeleton height={170} radius="md" />
      ) : (
        <>
          <Box pos="relative" mt={4}>
            <svg viewBox={`0 0 ${W} ${CY + 8}`} width="100%" style={{ display: "block", overflow: "visible" }}>
              <defs>
                <linearGradient id={`${uid}-stroke`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#FFD43B" />
                  <stop offset="55%" stopColor="#FF922B" />
                  <stop offset="100%" stopColor="#FA5252" />
                </linearGradient>
                <linearGradient id={`${uid}-fill`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF922B" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FF922B" stopOpacity="0" />
                </linearGradient>
                <radialGradient id={`${uid}-glow`}>
                  <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#FFC078" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FFC078" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Remaining path */}
              <path
                d={arc}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
                strokeDasharray="3 5"
                strokeLinecap="round"
              />

              {/* Traveled path + soft fill beneath */}
              {progress > 0 && (
                <>
                  <path d={traveledFill} fill={`url(#${uid}-fill)`} />
                  <path
                    d={traveled}
                    fill="none"
                    stroke={`url(#${uid}-stroke)`}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Horizon */}
              <line
                x1={4}
                x2={W - 4}
                y1={CY}
                y2={CY}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <circle cx={START_X} cy={CY} r={3} fill="#FFD43B" />
              <circle cx={END_X} cy={CY} r={3} fill={progress >= 1 ? "#FA5252" : "rgba(255,255,255,0.35)"} />

              {/* Sun */}
              {isDay ? (
                <g>
                  <circle cx={sunX} cy={sunY} r={22} fill={`url(#${uid}-glow)`}>
                    <animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={sunX} cy={sunY} r={8} fill="#FFD43B" stroke="#FFF3BF" strokeWidth="2" />
                </g>
              ) : (
                <circle cx={sunX} cy={CY} r={6} fill="rgba(255,255,255,0.35)" />
              )}
            </svg>

            <Stack
              gap={0}
              align="center"
              pos="absolute"
              style={{ left: 0, right: 0, bottom: 14, pointerEvents: "none" }}
            >
              <Text c="white" fw={700} size="lg" lh={1.1}>
                {Math.round(progress * 100)}%
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.6)">
                {status}
              </Text>
            </Stack>
          </Box>

          <Group justify="space-between" mt="md" wrap="nowrap">
            <Group gap={8} wrap="nowrap">
              <Box
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "rgba(250,176,5,0.15)"
                }}
              >
                <WiSunrise size={26} color="#FAB005" />
              </Box>
              <Stack gap={0}>
                <Text size="xs" c="rgba(255,255,255,0.6)">
                  Sunrise
                </Text>
                <Text c="white" fw={700}>
                  {sunrise?.format("h:mm A")}
                </Text>
              </Stack>
            </Group>
            <Group gap={8} wrap="nowrap">
              <Stack gap={0} align="flex-end">
                <Text size="xs" c="rgba(255,255,255,0.6)">
                  Sunset
                </Text>
                <Text c="white" fw={700}>
                  {sunset?.format("h:mm A")}
                </Text>
              </Stack>
              <Box
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "rgba(250,82,82,0.15)"
                }}
              >
                <WiSunset size={26} color="#FA5252" />
              </Box>
            </Group>
          </Group>
        </>
      )}
    </Box>
  );
}
