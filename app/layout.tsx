import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "onBoardX",
  description:
    "The industry-standard platform for secure authentication and real-time quizzes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);

  if (isMobile) {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (session?.user?.role === "user") {
      redirect("/unsupported-device");
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
        <OfflineIndicator />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
