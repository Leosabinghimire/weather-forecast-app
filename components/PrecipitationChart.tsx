"use client";

import { BarChart } from "@mantine/charts";
import { Box, Group, Skeleton, Text } from "@mantine/core";
import { WiRaindrop } from "react-icons/wi";
import dayjs from "dayjs";
import type { ForecastResponse } from "@/types/weather";

interface Props {
  data?: ForecastResponse;
  isLoading: boolean;
}

export default function PrecipitationChart({ data, isLoading }: Props) {
  const series = (data?.list ?? []).slice(0, 10).map((item) => ({
    time: dayjs.unix(item.dt).format("ha"),
    chance: Math.round(item.pop * 100)
  }));

  const peak = series.reduce((max, s) => (s.chance > max ? s.chance : max), 0);

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
          Peak {peak}%
        </Text>
      </Group>
      {isLoading || !data ? (
        <Skeleton height={180} radius="md" />
      ) : (
        <BarChart
          h={180}
          data={series}
          dataKey="time"
          series={[{ name: "chance", label: "Chance", color: "blue.4" }]}
          barProps={{ radius: 6 }}
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
          valueFormatter={(v) => `${v}%`}
          styles={{
            axis: { fill: "rgba(255,255,255,0.65)" },
            grid: { stroke: "rgba(255,255,255,0.08)" }
          }}
        />
      )}
    </Box>
  );
}
