"use client";

import Link from "next/link";
import { League_Gothic, Jost, Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";

const headingFont = League_Gothic({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const ampFont = Playfair_Display({ subsets: ["latin"], style: "italic", weight: "700", display: "swap" });

type Column = {
    title: React.ReactNode;
    body: React.ReactNode;
    cta: { label: string; href: string; targetId: string };
};

const columns: Column[] = [
    {
        title: "Pickup",
        body: (
            <>
                Order ahead and swing by when it&rsquo;s ready.{" "}
                <strong className="font-bold">Hot off the smoker, wrapped to go.</strong>{" "}
                Pick your plate online, choose a pickup time, and we&rsquo;ll have it
                waiting. Brisket, ribs, wings and all the sides, no guessing.
            </>
        ),
        cta: { label: "Order for pickup", href: "#menu", targetId: "menu" },
    },
    {
        title: "Delivery",
        body: (
            <>
                Can&rsquo;t leave the couch?{" "}
                <strong className="font-bold">We&rsquo;ll bring the smoke to you.</strong>{" "}
                Fire-kissed wings, tender brisket and rack ribs, delivered to your
                door while they&rsquo;re still hot. Order online and dinner is handled.
            </>
        ),
        cta: { label: "Order delivery", href: "#menu", targetId: "menu" },
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
                <strong className="font-bold">We bring the feast to your party</strong>{" "}
                with platters, party trays and full-service spreads.
            </>
        ),
        cta: { label: "View options", href: "#catering", targetId: "catering" },
    },
];

// Rough paper texture
const svg = (inner: string, size: number) =>
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${inner}</svg>")`;

const GRAIN = svg(
    "<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/>",
    200
);
const MOTTLE = svg(
    "<filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='3' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -0.2'/></filter><rect width='100%' height='100%' filter='url(%23m)'/>",
    600
);
const FLECKS = svg(
    "<filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -8.6'/></filter><rect width='100%' height='100%' filter='url(%23f)'/>",
    300
);

export default function ServiceColumns() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const elem = document.getElementById(targetId);
        if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            aria-label="Pickup, delivery, catering and events"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-white text-neutral-900`}
        >
            {/* Rough texture over white */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply"
                style={{
                    backgroundImage: `${FLECKS}, ${MOTTLE}, ${GRAIN}`,
                    backgroundSize: "300px 300px, 600px 600px, 200px 200px",
                }}
            />

            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 text-center sm:px-8 sm:py-16 md:grid-cols-3 md:gap-10 md:py-20 lg:gap-16">
                {columns.map((col, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <h2
                            className={`${headingFont.className} uppercase leading-none tracking-[0.01em] text-[#D42F16] text-[clamp(2.8rem,5.2vw,4.25rem)]`}
                        >
                            {col.title}
                        </h2>

                        <p className="mt-4 sm:mt-6 max-w-[28rem] text-[1.1rem] sm:text-[1.2rem] leading-[1.8] sm:leading-[1.85] md:text-[1.25rem]">
                            {col.body}
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-auto pt-8 sm:pt-10"
                        >
                            <a
                                href={col.cta.href}
                                onClick={(e) => handleScroll(e, col.cta.targetId)}
                                className="inline-block border-b-[3px] border-[#D9541A] pb-1 text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-neutral-900 transition-colors hover:text-[#D42F16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D42F16] cursor-pointer"
                            >
                                {col.cta.label}
                            </a>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}