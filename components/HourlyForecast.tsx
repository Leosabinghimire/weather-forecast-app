"use client";

import { AreaChart } from "@mantine/charts";
import { Box, Group, ScrollArea, Skeleton, Stack, Text } from "@mantine/core";
import Image from "next/image";
import type { ForecastResponse, Units } from "@/types/weather";
import { fmtTemp, tempUnit } from "@/utils/format";
import { cityTime } from "@/utils/time";
import { iconUrl } from "@/utils/weather";

interface Props {
  data?: ForecastResponse;
  units: Units;
  isLoading: boolean;
}

export default function HourlyForecast({ data, units, isLoading }: Props) {
  const tz = data?.city.timezone ?? 0;
  const items = (data?.list ?? []).slice(0, 10);
  const series = items.map((item) => ({
    time: cityTime(item.dt, tz).format("ha"),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    pop: Math.round(item.pop * 100)
  }));

  return (
    <Box className="glass fade-in" p="lg">
      <Text c="white" fw={700} size="sm" tt="uppercase" mb="sm" style={{ letterSpacing: 1 }}>
        Next 30 hours
      </Text>
      {isLoading || !data ? (
        <>
          <Skeleton height={112} radius="md" mb="md" />
          <Skeleton height={200} radius="md" />
        </>
      ) : (
        <>
          <ScrollArea type="auto" scrollbarSize={6} offsetScrollbars mb="md">
            <Group gap="sm" wrap="nowrap" pb={4}>
              {items.map((item, i) => {
                const pop = Math.round(item.pop * 100);
                return (
                  <Stack
                    key={item.dt}
                    gap={2}
                    align="center"
                    miw={72}
                    py="xs"
                    px={6}
                    style={{
                      borderRadius: 16,
                      background: i === 0 ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <Text size="xs" c="rgba(255,255,255,0.7)" fw={600}>
                      {cityTime(item.dt, tz).format("ha")}
                    </Text>
                    <Image
                      src={iconUrl(item.weather[0].icon, 2)}
                      alt={item.weather[0].description}
                      width={44}
                      height={44}
                      unoptimized
                    />
                    <Text c="white" fw={700} size="sm">
                      {fmtTemp(item.main.temp, units)}
                    </Text>
                    <Text size="xs" c={pop >= 30 ? "blue.3" : "rgba(255,255,255,0.4)"}>
                      💧 {pop}%
                    </Text>
                  </Stack>
                );
              })}
            </Group>
          </ScrollArea>

          <AreaChart
            h={200}
            data={series}
            dataKey="time"
            withGradient
            withDots
            curveType="natural"
            series={[
              { name: "temp", label: "Temperature", color: "cyan.4" },
              { name: "feels", label: "Feels like", color: "orange.4" }
            ]}
            tooltipAnimationDuration={150}
            gridAxis="y"
            tickLine="none"
            strokeDasharray="0"
            withXAxis
            withYAxis
            withLegend
            legendProps={{ verticalAlign: "top", height: 32 }}
            yAxisProps={{
              width: 44,
              tickFormatter: (v) => `${v}${tempUnit(units)}`
            }}
            areaChartProps={{ syncId: "hourly" }}
            valueFormatter={(v) => `${v}${tempUnit(units)}`}
            styles={{
              axis: { fill: "rgba(255,255,255,0.65)" },
              grid: { stroke: "rgba(255,255,255,0.08)" },
              legendItemName: { color: "rgba(255,255,255,0.75)" }
            }}
          />
        </>
      )}
    </Box>
  );
}
