import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backend Template",
  description: "API definition for the M295 project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
