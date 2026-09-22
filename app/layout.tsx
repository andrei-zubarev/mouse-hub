import type { Metadata } from "next";
import "./globals.css";
import { inter, poppins } from "./fonts";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { SideRail } from "@/components/layout/side-rail";
import { Footer } from "@/components/layout/footer";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { AccountModal } from "@/components/layout/account-modal";
import { SupportChat } from "@/components/layout/support-chat";
import { QuickViewModal } from "@/components/product/quick-view-modal";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "MOUSE HUB — Featherweight Magnesium Gaming Gear",
    template: "%s · MOUSE HUB",
  },
  description:
    "Ultra-light magnesium gaming mice, Hall-effect keyboards and SlimFlex mousepads engineered for speed, control and a premium feel.",
  keywords: [
    "MOUSE HUB",
    "gaming mouse",
    "magnesium mouse",
    "lightweight mouse",
    "Beast X",
    "Hall-effect keyboard",
  ],
  openGraph: {
    title: "MOUSE HUB — Featherweight Magnesium Gaming Gear",
    description:
      "Ultra-light magnesium gaming mice, Hall-effect keyboards and SlimFlex mousepads.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <AnnouncementBar />
        <Header />
        <SideRail />
        <main>{children}</main>
        <Footer />

        {/* Глобальные оверлеи, управляемые через ui-store */}
        <MobileMenu />
        <SearchOverlay />
        <CartDrawer />
        <QuickViewModal />
        <AccountModal />
        <SupportChat />
      </body>
    </html>
  );
}
