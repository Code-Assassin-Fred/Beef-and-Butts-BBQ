import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteBanner from "@/components/QuoteBanner";
import ServiceColumns from "@/components/ServiceColumns";
import Menu from "@/components/Menu";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <QuoteBanner />
      <ServiceColumns />
      <Menu />
    </main>
  );
}