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
import { buildAlerts } from "@/utils/alerts";
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
import WeatherAlerts from "./WeatherAlerts";
import WeatherTips from "./WeatherTips";

const REFRESH_MS = 10 * 60 * 1000;

export default function WeatherDashboard() {
  const active = useAppSelector((s) => s.weather.active);
  const units = useAppSelector((s) => s.preferences.units);

  const skip = !active;
  const coords = active ? { lat: active.lat, lon: active.lon } : { lat: 0, lon: 0 };

  const queryOpts = { skip, refetchOnMountOrArgChange: true, pollingInterval: REFRESH_MS };
  const currentQuery = useCurrentWeatherQuery({ ...coords, units }, queryOpts);
  const forecastQuery = useForecastQuery({ ...coords, units }, queryOpts);
  const aqiQuery = useAirPollutionQuery(coords, queryOpts);

  // Only show skeletons when there's nothing to display for the current city/units;
  // background refreshes keep the old data on screen.
  const currentLoading = !currentQuery.currentData;
  const forecastLoading = !forecastQuery.currentData;
  const aqiLoading = !aqiQuery.currentData;

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

  const alerts = useMemo(
    () => buildAlerts(currentQuery.data, forecastQuery.data, aqiQuery.data, units),
    [currentQuery.data, forecastQuery.data, aqiQuery.data, units]
  );

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
            <>
            <WeatherAlerts alerts={alerts} cityKey={`${active.lat},${active.lon}`} />
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <CurrentWeatherCard
                    data={currentQuery.data}
                    locationLabel={locationLabel}
                    country={active.country}
                    units={units}
                    isLoading={currentLoading}
                    refreshing={currentQuery.isFetching}
                    updatedAt={currentQuery.fulfilledTimeStamp}
                    onRefresh={() => {
                      currentQuery.refetch();
                      forecastQuery.refetch();
                      aqiQuery.refetch();
                    }}
                  />
                  <WeatherDetails
                    data={currentQuery.data}
                    units={units}
                    isLoading={currentLoading}
                  />
                  <HourlyForecast
                    data={forecastQuery.data}
                    units={units}
                    isLoading={forecastLoading}
                  />
                  <PrecipitationChart
                    data={forecastQuery.data}
                    isLoading={forecastLoading}
                  />
                  <DailyForecast
                    data={forecastQuery.data}
                    units={units}
                    isLoading={forecastLoading}
                  />
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="lg">
                  <SunTimes
                    data={currentQuery.data}
                    isLoading={currentLoading}
                  />
                  <WeatherTips
                    current={currentQuery.data}
                    forecast={forecastQuery.data}
                    air={aqiQuery.data}
                    units={units}
                    isLoading={currentLoading}
                  />
                  <AirQuality
                    data={aqiQuery.data}
                    isLoading={aqiLoading}
                  />
                  <SavedCities />
                </Stack>
              </Grid.Col>
            </Grid>
            </>
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
