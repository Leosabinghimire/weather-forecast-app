"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip
} from "@mantine/core";
import { FaRegHeart, FaHeart, FaLocationDot, FaArrowsRotate } from "react-icons/fa6";
import dayjs from "dayjs";
import Image from "next/image";
import type { CurrentWeather as CurrentWeatherT, Units } from "@/types/weather";
import { capitalizeWords, fmtTemp } from "@/utils/format";
import { iconUrl } from "@/utils/weather";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleFavorite } from "@/lib/features/weather/weatherSlice";

interface Props {
  data?: CurrentWeatherT;
  locationLabel: string;
  country: string;
  units: Units;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function CurrentWeatherCard({
  data,
  locationLabel,
  country,
  units,
  isLoading,
  onRefresh
}: Props) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.weather.active);
  const favorites = useAppSelector((s) => s.weather.favorites);
  const isFav =
    active &&
    favorites.some(
      (f) =>
        f.id ===
        `${active.lat.toFixed(3)},${active.lon.toFixed(3)}`
    );

  return (
    <Box
      className="glass-strong fade-in"
      p={{ base: "lg", sm: "xl" }}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4}>
          <Group gap={6} align="center">
            <FaLocationDot size={18} color="rgba(255,255,255,0.85)" />
            <Title order={2} c="white" lh={1.1} fz={{ base: 22, sm: 28 }}>
              {locationLabel || "—"}
            </Title>
            {country && (
              <Badge
                variant="light"
                color="gray"
                radius="sm"
                styles={{ root: { background: "rgba(255,255,255,0.12)", color: "white" } }}
              >
                {country}
              </Badge>
            )}
          </Group>
          <Text c="rgba(255,255,255,0.75)" size="sm">
            {data ? dayjs.unix(data.dt).format("dddd, MMM D · h:mm A") : ""}
          </Text>
        </Stack>
        <Group gap="xs">
          <Tooltip label={isFav ? "Remove from favorites" : "Save to favorites"} withArrow>
            <ActionIcon
              variant="subtle"
              color={isFav ? "pink" : "gray"}
              size="lg"
              radius="xl"
              aria-label="Toggle favorite"
              onClick={() => active && dispatch(toggleFavorite(active))}
              disabled={!active}
            >
              {isFav ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Refresh" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="xl"
              aria-label="Refresh"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <FaArrowsRotate size={20} color="white" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Group mt="lg" gap="xl" wrap="wrap" align="center">
        <Box style={{ position: "relative", width: 150, height: 150 }}>
          {isLoading || !data ? (
            <Skeleton circle height={150} />
          ) : (
            <Image
              src={iconUrl(data.weather[0].icon, 4)}
              alt={data.weather[0].description}
              width={200}
              height={200}
              style={{
                width: "100%",
                height: "100%",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.35))"
              }}
              unoptimized
            />
          )}
        </Box>

        <Stack gap={0}>
          {isLoading || !data ? (
            <>
              <Skeleton height={72} width={220} mb={8} />
              <Skeleton height={20} width={160} />
            </>
          ) : (
            <>
              <Group gap={8} align="baseline">
                <Text
                  c="white"
                  fw={800}
                  fz={{ base: 64, sm: 88 }}
                  lh={1}
                  style={{ letterSpacing: -2 }}
                >
                  {fmtTemp(data.main.temp, units)}
                </Text>
              </Group>
              <Text c="rgba(255,255,255,0.9)" size="lg" fw={500}>
                {capitalizeWords(data.weather[0].description)}
              </Text>
              <Text c="rgba(255,255,255,0.7)" size="sm">
                Feels like {fmtTemp(data.main.feels_like, units)} · H{" "}
                {fmtTemp(data.main.temp_max, units)} · L{" "}
                {fmtTemp(data.main.temp_min, units)}
              </Text>
            </>
          )}
        </Stack>
      </Group>
    </Box>
  );
}
