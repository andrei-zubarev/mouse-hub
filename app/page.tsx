import { Hero } from "@/components/home/hero";
import { CollectionGrid } from "@/components/home/collection-grid";
import { SwordsBanner } from "@/components/home/swords-banner";
import { BuiltWithMagnesium } from "@/components/home/built-with-magnesium";
import { PerfectMatch } from "@/components/home/perfect-match";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ModularKeyboard } from "@/components/home/modular-keyboard";
import { MousepadSection } from "@/components/home/mousepad-section";
import { DiscordCommunity } from "@/components/home/discord-community";
import { ServiceHighlights } from "@/components/home/service-highlights";

/** Главная страница — секции лендинга по порядку. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionGrid />
      <SwordsBanner />
      <BuiltWithMagnesium />
      <PerfectMatch />
      <ProductShowcase />
      <ModularKeyboard />
      <MousepadSection />
      <DiscordCommunity />
      <ServiceHighlights />
    </>
  );
}
