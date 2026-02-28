import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabina Checklist",
  description: "Checklist para eventos de la cabina fotográfica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
