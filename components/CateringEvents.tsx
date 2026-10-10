"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Anton,
    Jost,
    Montserrat,
    Great_Vibes,
    Playfair_Display,
} from "next/font/google";
import QuoteModal from "./QuoteModal";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const darkBodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });
const ampFont = Playfair_Display({ subsets: ["latin"], style: "italic", weight: "700", display: "swap" });

/* ------------------------------- Data -------------------------------- */

type Category = {
    id: string;
    title: string;
    description: string;
    groups: string[];
    image?: { src: string; alt: string };
};

const CATEGORIES: Category[] = [
    {
        id: "corporate",
        title: "Corporate & Workplace",
        description:
            "Business lunches, meetings, conferences and corporate functions. Smoked fresh and easy to serve, whatever the size of your team.",
        groups: [
            "Office lunches",
            "Team celebrations",
            "Client meetings",
            "Conferences & trade shows",
            "Grand openings",
        ],
        image: { src: "/Assets/sliced-brisket-with-greens.jpg", alt: "Sliced smoked brisket with fresh greens" },
    },
    {
        id: "weddings",
        title: "Weddings & Milestones",
        description:
            "Wedding receptions, anniversaries and engagement parties. Slow-smoked BBQ that gives your big day a menu people talk about.",
        groups: [
            "Weddings",
            "Engagement parties",
            "Rehearsal dinners",
            "Showers (bridal and baby)",
            "Anniversaries",
            "Graduations",
        ],
        image: { src: "/Assets/glazed-bbq-chicken.jpg", alt: "Glazed BBQ chicken platter" },
    },
    {
        id: "family",
        title: "Family & Social",
        description:
            "Birthdays, family gatherings and intimate celebrations, from backyard cookouts to game day. Food that keeps everyone at the table.",
        groups: [
            "Birthdays",
            "Backyard cookouts",
            "Family reunions",
            "Holiday gatherings",
            "Game day & watch parties",
        ],
        image: { src: "/Assets/bbq-ribs-with-bhajia.jpg", alt: "BBQ ribs with bhajia" },
    },
    {
        id: "community",
        title: "Community & Fundraisers",
        description:
            "School and church events, charity fundraisers, festivals and markets. Outdoor-ready BBQ that feeds a crowd and keeps the line moving.",
        groups: ["School & church events", "Charity fundraisers", "Festivals & markets"],
        image: { src: "/Assets/bhajia-with-chilli-sauce.jpg", alt: "Crispy bhajia with chilli sauce for community events" },
    },
];

/* ------------------------------ Textures ------------------------------ */

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

const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D42F16]";

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 10 14" aria-hidden="true">
            <path d="M1.5 1.5L7.5 7L1.5 12.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
    );
}

/* ------------------------------ Component ----------------------------- */

export default function CateringEvents() {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [selectedCategoryTitle, setSelectedCategoryTitle] = useState("Weddings & Receptions");

    const openQuote = (categoryTitle?: string) => {
        if (categoryTitle) setSelectedCategoryTitle(categoryTitle);
        setIsQuoteOpen(true);
    };

    return (
        <section id="catering" aria-label="Catering & Events" className={`${bodyFont.className} bg-[#0a0a0a]`}>
            <QuoteModal
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
                initialCategory={selectedCategoryTitle}
            />

            {/* Shared SVG filters */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="cat-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="9" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="5" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
                <filter id="cat-torn" x="-4%" y="-4%" width="108%" height="108%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="4" seed="12" result="edge" />
                    <feDisplacementMap in="SourceGraphic" in2="edge" scale="14" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* ============ Part 1: White paper section ============ */}
            <div className="relative isolate bg-white text-[#0f0f0f]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply"
                    style={{
                        backgroundImage: `${FLECKS}, ${MOTTLE}, ${GRAIN}`,
                        backgroundSize: "300px 300px, 600px 600px, 200px 200px",
                    }}
                />

                <div className="mx-auto max-w-6xl px-4 sm:px-8 pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-24">
                    <motion.header
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mx-auto max-w-5xl text-center"
                    >
                        <h2
                            className={`${displayFont.className} text-[clamp(1.1rem,4.2vw,4.2rem)] uppercase leading-[1.05] tracking-[0.02em] whitespace-nowrap`}
                            style={{ filter: "url(#cat-stamp)" }}
                        >
                            We bring the smoke to your table.
                        </h2>

                        <p className={`${scriptFont.className} mt-3 text-[clamp(1.8rem,3.8vw,3.2rem)] leading-none text-[#D42F16]`}>
                            Smoked slow. Served loud.
                        </p>

                        <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-relaxed text-neutral-700 md:text-xl max-w-3xl mx-auto">
                            From intimate backyard cookouts to full-scale corporate feasts, we slow-smoke barbecue over live hardwood fire and serve it fresh for any crowd.
                        </p>
                    </motion.header>

                    {/* Category List */}
                    <div className="mt-12 sm:mt-14 md:mt-20">
                        {CATEGORIES.map((cat, i) => {
                            const flip = i % 2 === 1;
                            return (
                                <motion.article
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.75, ease: "easeOut" }}
                                    className="relative mb-12 sm:mb-16 grid items-center last:mb-0 lg:mb-28 lg:grid-cols-12 lg:last:mb-0"
                                >
                                    <div
                                        className={`relative aspect-[4/3] sm:aspect-[16/10] lg:col-span-8 lg:row-start-1 ${flip ? "lg:col-start-5" : "lg:col-start-1"
                                            }`}
                                    >
                                        <div className="absolute inset-0 overflow-hidden" style={{ filter: "url(#cat-torn)" }}>
                                            {cat.image && (
                                                <Image
                                                    src={cat.image.src}
                                                    alt={cat.image.alt}
                                                    fill
                                                    sizes="(min-width: 1024px) 66vw, 100vw"
                                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                                />
                                            )}
                                            <div
                                                aria-hidden="true"
                                                className="absolute inset-0 shadow-[inset_0_0_45px_12px_rgba(70,8,6,0.65)]"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={`relative z-10 -mt-8 sm:-mt-12 mx-3 sm:mx-8 bg-[#0f0f0f] p-5 sm:p-8 text-white lg:mx-0 lg:mt-0 lg:col-span-7 lg:row-start-1 lg:p-9 rounded-sm shadow-xl ${flip ? "lg:col-start-1" : "lg:col-start-6"
                                            }`}
                                    >
                                        <h3
                                            className={`${displayFont.className} text-[clamp(1.75rem,3.6vw,3.25rem)] uppercase leading-[1.05] tracking-[0.02em]`}
                                            style={{ filter: "url(#cat-stamp)" }}
                                        >
                                            {cat.title}
                                        </h3>

                                        <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-neutral-200">{cat.description}</p>

                                        <ul className="mt-5 sm:mt-6 grid gap-x-8 gap-y-2 text-xs sm:text-[0.95rem] text-neutral-400 sm:grid-cols-2">
                                            {cat.groups.map((g) => (
                                                <li key={g} className="flex items-start gap-2.5 sm:gap-3">
                                                    <span aria-hidden="true" className="mt-[0.5rem] h-[3px] w-2.5 sm:w-3 shrink-0 bg-[#D42F16]" />
                                                    {g}
                                                </li>
                                            ))}
                                        </ul>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            type="button"
                                            onClick={() => openQuote(cat.title)}
                                            className={`${displayFont.className} mt-6 sm:mt-7 inline-flex items-center gap-2 bg-[#D42F16] px-4 sm:px-5 py-2.5 text-sm sm:text-base uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#B72511] ${focusRing}`}
                                        >
                                            Get a Quote
                                            <Arrow className="h-3.5 w-2.5" />
                                        </motion.button>
                                    </div>
                                </motion.article>
                            );
                        })}
                </div>

                {/* ============ Part 2: Catering & Events – How It Works ============ */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`${darkBodyFont.className} relative z-10 mt-16 sm:mt-20 md:mt-24`}
                >
                    <div className="relative rounded-sm bg-[#141414] p-3 sm:p-6 md:p-8 text-white shadow-2xl">
                        <div className="relative rounded-sm border border-[#D42F16]/70 p-4 sm:p-8 md:p-10">
                            <div className="relative -mt-8 sm:-mt-13 mb-6 sm:mb-8 text-center">
                                <div className="flex items-center justify-center gap-2 sm:gap-4">
                                    <span className="hidden h-[1px] w-12 bg-[#D42F16]/60 sm:block sm:w-24 md:w-32" />
                                    <span
                                        className={`${ampFont.className} italic bg-[#141414] px-3 sm:px-4 text-lg font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white sm:text-2xl md:text-3xl`}
                                    >
                                        CATERING &amp; EVENTS
                                    </span>
                                    <span className="hidden h-[1px] w-12 bg-[#D42F16]/60 sm:block sm:w-24 md:w-32" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-0">
                                <div className="flex flex-col items-center text-center md:px-6 lg:px-8">
                                    <span className={`${displayFont.className} text-xl sm:text-2xl font-bold text-[#D42F16]`}>
                                        1.
                                    </span>
                                    <h4 className={`${displayFont.className} text-xl sm:text-2xl uppercase tracking-[0.05em] text-[#D42F16]`}>
                                        Tell Us Your Vision
                                    </h4>
                                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-200">
                                        Share your event details, guest count and menu preferences with our team.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center text-center md:border-x md:border-white/15 md:px-6 lg:px-8">
                                    <span className={`${displayFont.className} text-xl sm:text-2xl font-bold text-[#D42F16]`}>
                                        2.
                                    </span>
                                    <h4 className={`${displayFont.className} text-xl sm:text-2xl uppercase tracking-[0.05em] text-[#D42F16]`}>
                                        We Plan the Feast
                                    </h4>
                                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-200">
                                        We build a custom menu, handle logistics, and lock everything in.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center text-center md:px-6 lg:px-8">
                                    <span className={`${displayFont.className} text-xl sm:text-2xl font-bold text-[#D42F16]`}>
                                        3.
                                    </span>
                                    <h4 className={`${displayFont.className} text-xl sm:text-2xl uppercase tracking-[0.05em] text-[#D42F16]`}>
                                        We Show Up &amp; Serve
                                    </h4>
                                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-200">
                                        Our crew arrives, sets up, serves your guests, and cleans up. You just enjoy.
                                    </p>
                                </div>
                            </div>

                            <p className={`${scriptFont.className} mt-8 text-center text-[clamp(1.4rem,3vw,2.2rem)] leading-snug text-[#D42F16]`}>
                                You bring the people. We bring the smoke.
                            </p>

                            <div className="mt-6 border-t border-[#D42F16]/50 pt-6">
                                <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                                    <div className="flex items-center gap-3">
                                        <svg
                                            className="h-6 w-6 text-[#D42F16] shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                        <span className="text-xs sm:text-sm font-bold text-white md:text-base">
                                            Order Catering by phone at <a href="tel:+16478898033" className="hover:text-[#D42F16] transition-colors">(647) 889-8033</a>
                                        </span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        type="button"
                                        onClick={() => openQuote("Catering Inquiry")}
                                        className={`${displayFont.className} w-auto rounded bg-[#D42F16] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#B72511] ${focusRing}`}
                                    >
                                        Inquire for Catering
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
        </section>
    );
}