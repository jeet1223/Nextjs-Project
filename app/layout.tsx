import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Krishna Ceramics",
  description: "Premium ceramic products at unbeatable prices",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
        {children}
      </body>
    </html>
  );
}