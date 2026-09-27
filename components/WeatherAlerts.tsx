"use client";

import { useState } from "react";
import { ActionIcon, Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { FaTriangleExclamation, FaCircleInfo, FaXmark } from "react-icons/fa6";
import type { WeatherAlert } from "@/utils/alerts";

interface Props {
  alerts: WeatherAlert[];
  /** Identifies the city so dismissals don't carry over to another one. */
  cityKey: string;
}

const STYLE = {
  warning: {
    icon: <FaTriangleExclamation size={18} />,
    accent: "#FF6B6B",
    bg: "linear-gradient(135deg, rgba(250,82,82,0.28), rgba(250,82,82,0.12))",
    border: "rgba(255,107,107,0.45)",
    label: "Warning"
  },
  advisory: {
    icon: <FaCircleInfo size={18} />,
    accent: "#FFC078",
    bg: "linear-gradient(135deg, rgba(253,126,20,0.24), rgba(253,126,20,0.08))",
    border: "rgba(255,192,120,0.4)",
    label: "Advisory"
  }
} as const;

export default function WeatherAlerts({ alerts, cityKey }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const visible = alerts.filter((a) => !dismissed.includes(`${cityKey}:${a.id}`));
  if (!visible.length) return null;

  const shown = expanded ? visible : visible.slice(0, 1);
  const hidden = visible.length - shown.length;

  return (
    <Stack gap="xs" className="fade-in" role="region" aria-label="Weather alerts">
      {shown.map((a) => {
        const s = STYLE[a.severity];
        return (
          <Group
            key={a.id}
            role="alert"
            wrap="nowrap"
            align="flex-start"
            gap="sm"
            p="md"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 16,
              backdropFilter: "blur(18px)"
            }}
          >
            <Box
              c={s.accent}
              mt={2}
              className={a.severity === "warning" ? "alert-pulse" : undefined}
              style={{ flexShrink: 0 }}
            >
              {s.icon}
            </Box>
            <Stack gap={2} style={{ flex: 1 }}>
              <Group gap={8}>
                <Text c="white" fw={700} size="sm">
                  {a.title}
                </Text>
                <Text
                  size="10px"
                  fw={700}
                  tt="uppercase"
                  px={6}
                  py={1}
                  c={s.accent}
                  style={{ border: `1px solid ${s.border}`, borderRadius: 6, letterSpacing: 0.5 }}
                >
                  {s.label}
                </Text>
              </Group>
              <Text c="rgba(255,255,255,0.85)" size="sm">
                {a.message}
              </Text>
            </Stack>
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="xl"
              size="sm"
              aria-label={`Dismiss ${a.title}`}
              onClick={() => setDismissed((d) => [...d, `${cityKey}:${a.id}`])}
            >
              <FaXmark size={14} color="white" />
            </ActionIcon>
          </Group>
        );
      })}
      <Group justify="space-between" px={4}>
        <Text size="xs" c="rgba(255,255,255,0.5)">
          Based on forecast data — not an official warning. Check your national weather service.
        </Text>
        {(hidden > 0 || expanded) && visible.length > 1 && (
          <Anchor component="button" size="xs" c="white" fw={600} onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Show less" : `+${hidden} more alert${hidden > 1 ? "s" : ""}`}
          </Anchor>
        )}
      </Group>
    </Stack>
  );
}
