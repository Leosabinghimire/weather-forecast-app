"use client";

import { AreaChart } from "@mantine/charts";
import { Box, Skeleton, Text } from "@mantine/core";
import dayjs from "dayjs";
import type { ForecastResponse, Units } from "@/types/weather";
import { tempUnit } from "@/utils/format";

interface Props {
  data?: ForecastResponse;
  units: Units;
  isLoading: boolean;
}

export default function HourlyForecast({ data, units, isLoading }: Props) {
  const series = (data?.list ?? []).slice(0, 10).map((item) => ({
    time: dayjs.unix(item.dt).format("ha"),
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
        <Skeleton height={240} radius="md" />
      ) : (
        <AreaChart
          h={240}
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
          yAxisProps={{
            width: 44,
            tickFormatter: (v) => `${v}${tempUnit(units)}`
          }}
          areaChartProps={{ syncId: "hourly" }}
          valueFormatter={(v) => `${v}${tempUnit(units)}`}
          styles={{
            axis: { fill: "rgba(255,255,255,0.65)" },
            grid: { stroke: "rgba(255,255,255,0.08)" }
          }}
        />
      )}
    </Box>
  );
}
