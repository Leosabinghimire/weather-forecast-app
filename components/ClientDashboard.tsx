"use client";

import dynamic from "next/dynamic";
import { Center, Loader } from "@mantine/core";

// The dashboard depends on the store rehydrated from localStorage, which the
// static HTML can't know about. Rendering it only in the browser avoids a
// hydration mismatch when the saved city loads mid-hydration.
const WeatherDashboard = dynamic(() => import("./WeatherDashboard"), {
  ssr: false,
  loading: () => (
    <Center mih="100vh">
      <Loader color="white" type="dots" />
    </Center>
  )
});

export default function ClientDashboard() {
  return <WeatherDashboard />;
}
