import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cartly — Upgrade your everyday",
  description:
    "A headless commerce storefront with product discovery, a smart cart, discount codes and a demo checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
