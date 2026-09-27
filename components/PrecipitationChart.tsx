"use client";

import { BarChart } from "@mantine/charts";
import { Box, Group, Skeleton, Text } from "@mantine/core";
import { WiRaindrop } from "react-icons/wi";
import { cityTime } from "@/utils/time";
import type { ForecastResponse } from "@/types/weather";

interface Props {
  data?: ForecastResponse;
  isLoading: boolean;
}

export default function PrecipitationChart({ data, isLoading }: Props) {
  const tz = data?.city.timezone ?? 0;
  const series = (data?.list ?? []).slice(0, 10).map((item) => ({
    time: cityTime(item.dt, tz).format("ha"),
    chance: Math.round(item.pop * 100),
    mm: +((item.rain?.["3h"] ?? 0) + (item.snow?.["3h"] ?? 0)).toFixed(1)
  }));

  const peak = series.reduce((max, s) => (s.chance > max ? s.chance : max), 0);
  const totalMm = series.reduce((sum, s) => sum + s.mm, 0);
  const next = series.find((s) => s.mm > 0);
  // Fixed floor of 4 mm so light drizzle doesn't render as a full-height bar;
  // rounded up to a multiple of 4 so the ticks are whole numbers.
  const mmMax = Math.max(4, Math.ceil(Math.max(...series.map((s) => s.mm), 0) / 4) * 4);
  const mmTicks = [0, 1, 2, 3, 4].map((i) => (mmMax / 4) * i);

  return (
    <Box className="glass fade-in" p="lg">
      <Group justify="space-between" align="center" mb="sm">
        <Group gap={6} align="center">
          <WiRaindrop size={22} color="#4DABF7" />
          <Text c="white" fw={700} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>
            Chance of rain
          </Text>
        </Group>
        <Text c="rgba(255,255,255,0.6)" size="xs">
          Peak {peak}% · {totalMm.toFixed(1)} mm total
        </Text>
      </Group>
      {data && !isLoading && (
        <Text c="rgba(255,255,255,0.75)" size="sm" mb="xs">
          {!next
            ? "No precipitation expected in the next 30 hours"
            : totalMm < 1
              ? `Light showers possible around ${next.time}`
              : `Rain expected from around ${next.time}`}
        </Text>
      )}
      {isLoading || !data ? (
        <Skeleton height={180} radius="md" />
      ) : (
        <BarChart
          h={200}
          data={series}
          dataKey="time"
          series={[
            { name: "chance", label: "Chance (%)", color: "blue.4" },
            { name: "mm", label: "Volume (mm)", color: "cyan.2", yAxisId: "right" }
          ]}
          withRightYAxis
          rightYAxisProps={{
            width: 48,
            domain: [0, mmMax],
            ticks: mmTicks,
            tickFormatter: (v: number) => `${v} mm`
          }}
          withLegend
          legendProps={{ verticalAlign: "top", height: 32 }}
          barProps={{ radius: [4, 4, 0, 0] }}
          gridAxis="y"
          tickLine="none"
          withXAxis
          withYAxis
          yAxisProps={{
            width: 44,
            domain: [0, 100],
            ticks: [0, 25, 50, 75, 100],
            tickFormatter: (v) => `${v}%`
          }}
          styles={{
            axis: { fill: "rgba(255,255,255,0.65)" },
            grid: { stroke: "rgba(255,255,255,0.08)" },
            legendItemName: { color: "rgba(255,255,255,0.75)" }
          }}
        />
      )}
    </Box>
  );
}
