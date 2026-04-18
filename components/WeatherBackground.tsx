"use client";

import { Box } from "@mantine/core";
import { moodGradient, type WeatherMood } from "@/utils/weather";

interface Props {
  mood: WeatherMood;
}

export default function WeatherBackground({ mood }: Props) {
  const g = moodGradient(mood);

  return (
    <Box
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        background: `linear-gradient(${g.angle}deg, ${g.from} 0%, ${g.to} 100%)`,
        transition: "background 1.2s ease"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(255,255,255,0.14) 0%, transparent 60%), radial-gradient(900px 500px at 10% 110%, rgba(0,0,0,0.35) 0%, transparent 55%)"
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: 420,
          height: 420,
          left: "-6%",
          top: "12%",
          background: `radial-gradient(circle at 30% 30%, ${g.from}, transparent 65%)`
        }}
      />
      <div
        className="bg-orb two"
        style={{
          width: 520,
          height: 520,
          right: "-8%",
          top: "8%",
          background: `radial-gradient(circle at 40% 40%, ${g.to}, transparent 65%)`
        }}
      />
      <div
        className="bg-orb three"
        style={{
          width: 360,
          height: 360,
          left: "35%",
          bottom: "-8%",
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25), transparent 65%)"
        }}
      />
    </Box>
  );
}
