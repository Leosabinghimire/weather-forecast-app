import type { Metadata, Viewport } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";

import Providers, { HeadColorSchemeScript, mantineHtmlProps } from "./providers";

const STRIP_INJECTED_HEAD_NODES = `(function(){var h=document.head;if(!h)return;var n=h.firstChild;while(n){var x=n.nextSibling;if(n.nodeType===8||(n.nodeType===3&&!n.data.trim()))h.removeChild(n);n=x}})();`;

export const metadata: Metadata = {
  title: "Atmos — A beautiful weather experience",
  description:
    "A polished, real-time weather dashboard with forecasts, air quality, and more. Built with Next.js, Mantine, and Redux Toolkit.",
  applicationName: "Atmos Weather"
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        {/* Netlify injects a "hosted on Netlify" comment (plus a newline) into <head>
            on the production domain. React hydrates <head> too, so those extra nodes
            cause hydration error #418. Strip them before hydration starts. */}
        <script dangerouslySetInnerHTML={{ __html: STRIP_INJECTED_HEAD_NODES }} />
        <HeadColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Root layout covers every route, so the pages/_document rule doesn't apply */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
