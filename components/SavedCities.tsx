"use client";

import {
  ActionIcon,
  Box,
  Group,
  ScrollArea,
  Stack,
  Text,
  Tooltip
} from "@mantine/core";
import { FaRegClock, FaHeart, FaLocationDot, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  clearRecent,
  removeFavorite,
  removeRecent,
  setActiveLocation
} from "@/lib/features/weather/weatherSlice";
import type { SavedCity } from "@/types/weather";

function CityRow({
  city,
  onClick,
  onRemove,
  removeTooltip
}: {
  city: SavedCity;
  onClick: () => void;
  onRemove: () => void;
  removeTooltip: string;
}) {
  return (
    <Group
      wrap="nowrap"
      gap="xs"
      px="sm"
      py={8}
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "background 120ms ease"
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.09)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      <FaLocationDot size={14} color="rgba(255,255,255,0.7)" />
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text c="white" size="sm" fw={600} truncate>
          {city.name}
        </Text>
        <Text c="rgba(255,255,255,0.55)" size="xs" truncate>
          {[city.state, city.country].filter(Boolean).join(", ")}
        </Text>
      </Box>
      <Tooltip label={removeTooltip} withArrow>
        <ActionIcon
          size="sm"
          variant="subtle"
          color="gray"
          aria-label={removeTooltip}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <FaXmark size={12} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default function SavedCities() {
  const dispatch = useAppDispatch();
  const recent = useAppSelector((s) => s.weather.recent);
  const favorites = useAppSelector((s) => s.weather.favorites);

  const load = (c: SavedCity) =>
    dispatch(
      setActiveLocation({
        name: c.name,
        country: c.country,
        state: c.state,
        lat: c.lat,
        lon: c.lon
      })
    );

  return (
    <Box className="glass fade-in" p="lg">
      <Group justify="space-between" mb="xs">
        <Group gap={6}>
          <FaHeart size={14} color="#FF6B9E" />
          <Text c="white" fw={700} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>
            Favorites
          </Text>
        </Group>
        <Text c="rgba(255,255,255,0.5)" size="xs">
          {favorites.length}/12
        </Text>
      </Group>
      {favorites.length === 0 ? (
        <Text c="rgba(255,255,255,0.55)" size="xs" mb="md">
          Tap the heart on any city to pin it here.
        </Text>
      ) : (
        <ScrollArea h={Math.min(160, favorites.length * 56)} type="auto" offsetScrollbars>
          <Stack gap={6} mb="md">
            {favorites.map((c) => (
              <CityRow
                key={c.id}
                city={c}
                onClick={() => load(c)}
                onRemove={() => dispatch(removeFavorite(c.id))}
                removeTooltip="Remove favorite"
              />
            ))}
          </Stack>
        </ScrollArea>
      )}

      <Group justify="space-between" mt="md" mb="xs">
        <Group gap={6}>
          <FaRegClock size={14} color="rgba(255,255,255,0.7)" />
          <Text c="white" fw={700} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>
            Recent
          </Text>
        </Group>
        {recent.length > 0 && (
          <Tooltip label="Clear all" withArrow>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              aria-label="Clear recent"
              onClick={() => dispatch(clearRecent())}
            >
              <FaTrashCan size={12} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      {recent.length === 0 ? (
        <Text c="rgba(255,255,255,0.55)" size="xs">
          Searched cities will appear here.
        </Text>
      ) : (
        <ScrollArea h={Math.min(180, recent.length * 56)} type="auto" offsetScrollbars>
          <Stack gap={6}>
            {recent.map((c) => (
              <CityRow
                key={c.id}
                city={c}
                onClick={() => load(c)}
                onRemove={() => dispatch(removeRecent(c.id))}
                removeTooltip="Remove"
              />
            ))}
          </Stack>
        </ScrollArea>
      )}
    </Box>
  );
}
