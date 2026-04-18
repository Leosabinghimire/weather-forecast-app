"use client";

import { Box, Container, Grid, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";
import {
  useAirPollutionQuery,
  useCurrentWeatherQuery,
  useForecastQuery
} from "@/lib/features/weather/weatherApi";
import { resolveMood } from "@/utils/weather";
import AirQuality from "./AirQuality";
import CurrentWeatherCard from "./CurrentWeather";
import DailyForecast from "./DailyForecast";
import EmptyState from "./EmptyState";
import HeaderBar from "./HeaderBar";
import HourlyForecast from "./HourlyForecast";
import PrecipitationChart from "./PrecipitationChart";
import SavedCities from "./SavedCities";
import SearchBar from "./SearchBar";
import SunTimes from "./SunTimes";
import WeatherBackground from "./WeatherBackground";
import WeatherDetails from "./WeatherDetails";

export default function WeatherDashboard() {
  const active = useAppSelector((s) => s.weather.active);
  const units = useAppSelector((s) => s.preferences.units);

  const skip = !active;
  const coords = active ? { lat: active.lat, lon: active.lon } : { lat: 0, lon: 0 };

  const currentQuery = useCurrentWeatherQuery(
    { ...coords, units },
    { skip, refetchOnMountOrArgChange: true }
  );
  const forecastQuery = useForecastQuery(
    { ...coords, units },
    { skip, refetchOnMountOrArgChange: true }
  );
  const aqiQuery = useAirPollutionQuery(coords, {
    skip,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (currentQuery.error) {
      notifications.show({
        color: "red",
        title: "Could not load weather",
        message: "Check your connection or API key and try again."
      });
    }
  }, [currentQuery.error]);

  const mood = useMemo(() => {
    const c = currentQuery.data;
    if (!c) return "clear-night" as const;
    const isNight =
      c.dt < c.sys.sunrise || c.dt > c.sys.sunset || c.weather[0].icon.endsWith("n");
    return resolveMood(c.weather[0], c.main.temp, isNight);
  }, [currentQuery.data]);

  const locationLabel = active
    ? [active.name, active.state].filter(Boolean).join(", ")
    : "";

  return (
    <>
      <WeatherBackground mood={mood} />
      <Container size="xl" py={{ base: "md", sm: "xl" }} px={{ base: "sm", sm: "md" }}>
        <Stack gap="lg">
          <HeaderBar />
          <SearchBar />

          {!active ? (
            <EmptyState />
          ) : (
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <CurrentWeatherCard
                    data={currentQuery.data}
                    locationLabel={locationLabel}
                    country={active.country}
                    units={units}
                    isLoading={currentQuery.isFetching}
                    onRefresh={() => {
                      currentQuery.refetch();
                      forecastQuery.refetch();
                      aqiQuery.refetch();
                    }}
                  />
                  <WeatherDetails
                    data={currentQuery.data}
                    units={units}
                    isLoading={currentQuery.isFetching}
                  />
                  <HourlyForecast
                    data={forecastQuery.data}
                    units={units}
                    isLoading={forecastQuery.isFetching}
                  />
                  <PrecipitationChart
                    data={forecastQuery.data}
                    isLoading={forecastQuery.isFetching}
                  />
                  <DailyForecast
                    data={forecastQuery.data}
                    units={units}
                    isLoading={forecastQuery.isFetching}
                  />
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="lg">
                  <SunTimes
                    data={currentQuery.data}
                    isLoading={currentQuery.isFetching}
                  />
                  <AirQuality
                    data={aqiQuery.data}
                    isLoading={aqiQuery.isFetching}
                  />
                  <SavedCities />
                </Stack>
              </Grid.Col>
            </Grid>
          )}

          <Box mt="xl" pb="lg">
            <Text c="rgba(255,255,255,0.5)" size="xs" ta="center">
              Data © OpenWeatherMap · Built with Next.js, Mantine UI & Redux
              Toolkit
            </Text>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
