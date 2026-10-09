import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteBanner from "@/components/QuoteBanner";
import ServiceColumns from "@/components/ServiceColumns";
import Menu from "@/components/Menu";
import CateringEvents from "@/components/CateringEvents";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <QuoteBanner />
      <ServiceColumns />
      <Menu />
      <CateringEvents />
      <About />
    </main>
  );
}