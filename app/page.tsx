import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteBanner from "@/components/QuoteBanner";
import ServiceColumns from "@/components/ServiceColumns";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <QuoteBanner />
      <ServiceColumns />
    </main>
  );
}