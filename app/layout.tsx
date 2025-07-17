import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Schema Generator Tool",
  description:
    "Automatically generate Zod validation schemas, TypeScript types, and database models from your schema definitions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="icon" href="image/favicon.png" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
