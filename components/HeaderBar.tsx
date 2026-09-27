"use client";

import { Box, Group, SegmentedControl, Text } from "@mantine/core";
import { FaCloudBolt } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUnits } from "@/lib/features/preferences/preferencesSlice";

export default function HeaderBar() {
  const dispatch = useAppDispatch();
  const units = useAppSelector((s) => s.preferences.units);

  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="md">
      <Group gap="sm">
        <Box
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "grid",
            placeItems: "center"
          }}
        >
          <FaCloudBolt size={20} color="white" />
        </Box>
        <Box>
          <Text c="white" fw={800} size="lg" lh={1}>
            Atmos
          </Text>
          <Text c="rgba(255,255,255,0.65)" size="xs">
            Real-time weather, beautifully.
          </Text>
        </Box>
      </Group>

      <Group gap="xs">
        <SegmentedControl
          size="sm"
          radius="xl"
          value={units}
          onChange={(v) => dispatch(setUnits(v as "metric" | "imperial"))}
          data={[
            { value: "metric", label: "°C" },
            { value: "imperial", label: "°F" }
          ]}
          styles={{
            root: {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)"
            },
            label: { color: "white" },
            indicator: { background: "rgba(255,255,255,0.22)" }
          }}
        />
      </Group>
    </Group>
  );
}
