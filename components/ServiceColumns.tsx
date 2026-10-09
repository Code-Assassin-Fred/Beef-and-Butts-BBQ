import Link from "next/link";
import { League_Gothic, Jost, Playfair_Display } from "next/font/google";

const headingFont = League_Gothic({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const ampFont = Playfair_Display({ subsets: ["latin"], style: "italic", weight: "700", display: "swap" });

type Column = {
    title: React.ReactNode;
    body: React.ReactNode;
    cta: { label: string; href: string };
};

// TODO: swap the hrefs for the real ordering / delivery / inquiry links
const columns: Column[] = [
    {
        title: "Pickup",
        body: (
            <>
                Order ahead and swing by when it&rsquo;s ready.{" "}
                <strong className="font-bold text-white">Hot off the smoker, wrapped to go.</strong>{" "}
                Pick your plate online, choose a pickup time, and we&rsquo;ll have it
                waiting. Brisket, ribs, wings and all the sides, no guessing.
            </>
        ),
        cta: { label: "Order for pickup", href: "/order?type=pickup" },
    },
    {
        title: "Delivery",
        body: (
            <>
                Can&rsquo;t leave the couch?{" "}
                <strong className="font-bold text-white">We&rsquo;ll bring the smoke to you.</strong>{" "}
                Fire-kissed wings, tender brisket and rack ribs, delivered to your
                door while they&rsquo;re still hot. Order online and dinner is handled.
            </>
        ),
        cta: { label: "Order delivery", href: "/order?type=delivery" },
    },
    {
        title: (
            <>
                Catering{" "}
                <span className={`${ampFont.className} text-[0.8em] font-bold normal-case`}>&amp;</span>{" "}
                Events
            </>
        ),
        body: (
            <>
                Backyard cookouts, office lunches, big celebrations.{" "}
                <strong className="font-bold text-white">We bring the pit to your party</strong>{" "}
                with platters, party trays and full-service spreads. Looking for
                something more intimate? Ask about our six-seat Smoke Sessions.
            </>
        ),
        cta: { label: "Request a catering quote", href: "/catering" },
    },
];

// Fine film grain, tiled. Drawn as an inline SVG so no image asset is needed.
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function ServiceColumns() {
    return (
        <section
            aria-label="Pickup, delivery, catering and events"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#131313] to-[#1c1c1c] text-neutral-300`}
        >
            {/* Shared SVG filters that rough up the edges */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                {/* Torn / charred edge */}
                <filter id="bnb-torn" x="-5%" y="-50%" width="110%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.22" numOctaves="4" seed="4" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                {/* Scattered soot flecks */}
                <filter id="bnb-flecks" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="11" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -6.3" result="speck" />
                    <feComposite in="SourceGraphic" in2="speck" operator="in" />
                </filter>
                {/* Ember streak at the bottom */}
                <filter id="bnb-streak" x="-5%" y="-300%" width="110%" height="700%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="3" seed="2" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* Film grain across the whole section */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
                style={{ backgroundImage: GRAIN }}
            />

            {/* TOP EDGE: warm glow showing through a torn black band */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28">
                <div
                    className="absolute inset-0 opacity-80"
                    style={{
                        background:
                            "radial-gradient(ellipse 22% 100% at 95% 0%, rgba(235,125,40,.65), transparent 70%), radial-gradient(ellipse 30% 90% at 62% 0%, rgba(150,70,35,.45), transparent 70%), radial-gradient(ellipse 30% 90% at 18% 0%, rgba(110,60,40,.4), transparent 70%)",
                    }}
                />
                {/* Solid charred band with ragged lower edge */}
                <div className="absolute inset-x-0 -top-4 h-12 bg-[#080808]" style={{ filter: "url(#bnb-torn)" }} />
                {/* Soot flecks drifting below the edge */}
                <div
                    className="absolute inset-x-0 top-6 h-14 bg-[#080808]"
                    style={{
                        filter: "url(#bnb-flecks)",
                        WebkitMaskImage: "linear-gradient(to bottom, #000, transparent)",
                        maskImage: "linear-gradient(to bottom, #000, transparent)",
                    }}
                />
            </div>

            {/* BOTTOM EDGE: red-to-amber ember streak */}
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 -z-10 h-3 w-[78%]">
                <div
                    className="h-full w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, #6e1209 8%, #b3260f 30%, #d97a1c 50%, #b3260f 62%, #7a170c 85%, transparent 100%)",
                        filter: "url(#bnb-streak)",
                    }}
                />
            </div>

            <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-28 text-center md:grid-cols-3 md:gap-10 md:pb-28 md:pt-32 lg:gap-16">
                {columns.map((col, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <h2
                            className={`${headingFont.className} uppercase leading-none tracking-[0.01em] text-[#E5391C] text-[clamp(3rem,5.2vw,4.25rem)]`}
                        >
                            {col.title}
                        </h2>

                        <p className="mt-6 max-w-[28rem] text-[1.2rem] leading-[1.85] md:text-[1.25rem]">
                            {col.body}
                        </p>

                        <Link
                            href={col.cta.href}
                            className="mt-auto inline-block border-b-[3px] border-[#E0601F] pb-1 pt-10 text-[0.95rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:text-[#FF7A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7A3D]"
                        >
                            {col.cta.label}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}