import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteBanner from "@/components/QuoteBanner";
import ServiceColumns from "@/components/ServiceColumns";
import Menu from "@/components/Menu";
import CateringEvents from "@/components/CateringEvents";
import About from "@/components/About";
import OrderBanner from "@/components/OrderBanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
      <OrderBanner />
      <Contact />
      <Footer />
    </main>
  );
}