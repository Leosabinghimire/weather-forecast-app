"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { store } from "@/lib/store";
import { rehydrateStore, subscribePersist } from "@/lib/persist";

export { mantineHtmlProps };

const theme = createTheme({
  primaryColor: "cyan",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "700"
  },
  defaultRadius: "lg",
  cursorType: "pointer",
  respectReducedMotion: true,
  components: {
    Paper: {
      defaultProps: { shadow: "xs", withBorder: false }
    },
    Card: {
      defaultProps: { shadow: "xs" }
    }
  }
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    rehydrateStore(store);
    const unsub = subscribePersist(store);
    return () => {
      unsub();
    };
  }, []);

  return (
    <Provider store={store}>
      {/* The design is dark-only (hardcoded glass colors), so keep Mantine in sync */}
      <MantineProvider theme={theme} forceColorScheme="dark">
        <Notifications position="top-right" zIndex={2000} />
        {children}
      </MantineProvider>
    </Provider>
  );
}

export function HeadColorSchemeScript() {
  return <ColorSchemeScript forceColorScheme="dark" />;
}
