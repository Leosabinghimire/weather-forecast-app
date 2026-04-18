"use client";

import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { FaLocationCrosshairs, FaMagnifyingGlass } from "react-icons/fa6";
import { notifications } from "@mantine/notifications";
import { useAppDispatch } from "@/lib/hooks";
import { setActiveLocation } from "@/lib/features/weather/weatherSlice";
import { useLazyReverseGeocodeQuery } from "@/lib/features/weather/weatherApi";

const SUGGESTIONS = [
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Kathmandu", country: "NP", lat: 27.7172, lon: 85.324 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 }
];

export default function EmptyState() {
  const dispatch = useAppDispatch();
  const [reverse] = useLazyReverseGeocodeQuery();

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await reverse({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          }).unwrap();
          const first = r[0];
          dispatch(
            setActiveLocation({
              name: first?.name ?? "Current location",
              country: first?.country ?? "",
              state: first?.state,
              lat: pos.coords.latitude,
              lon: pos.coords.longitude
            })
          );
        } catch {
          notifications.show({
            color: "red",
            title: "Failed to locate",
            message: "Try searching instead."
          });
        }
      },
      () =>
        notifications.show({
          color: "red",
          title: "Location denied",
          message: "Allow location access or pick a suggestion below."
        })
    );
  };

  return (
    <Box className="glass-strong fade-in" p={{ base: "xl", sm: 40 }} mt="md">
      <Stack align="center" gap="sm" ta="center">
        <Box style={{ fontSize: 64 }}>🌤️</Box>
        <Title order={2} c="white" fz={{ base: 22, sm: 30 }}>
          Where are you looking today?
        </Title>
        <Text c="rgba(255,255,255,0.75)" maw={520}>
          Search for any city above, use your current location, or pick a popular
          destination to begin.
        </Text>

        <Group mt="xs" gap="xs">
          <Button
            leftSection={<FaLocationCrosshairs size={16} />}
            radius="xl"
            variant="white"
            color="dark"
            onClick={useMyLocation}
          >
            Use my location
          </Button>
        </Group>

        <Group mt="md" gap={8} justify="center">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s.name}
              size="xs"
              radius="xl"
              variant="light"
              leftSection={<FaMagnifyingGlass size={12} />}
              onClick={() =>
                dispatch(
                  setActiveLocation({
                    name: s.name,
                    country: s.country,
                    lat: s.lat,
                    lon: s.lon
                  })
                )
              }
              styles={{
                root: {
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "white"
                }
              }}
            >
              {s.name}
            </Button>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}
