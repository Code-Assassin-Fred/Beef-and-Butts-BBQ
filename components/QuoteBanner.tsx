"use client";

import { Anton } from "next/font/google";
import { motion } from "framer-motion";

// Condensed, heavy stamp-style display face (self-hosted by next/font)
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

// Fine film grain, tiled. Inline SVG, so no image asset is needed.
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function QuoteBanner() {
    return (
        <section
            aria-label="Beef N Butts BBQ statement"
            className="relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#131313] to-[#1c1c1c]"
        >
            {/* Shared SVG filters */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                {/* Inked stamp edges for the headline */}
                <filter id="stamp-rough" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                {/* Torn / charred top edge */}
                <filter id="bnb-torn" x="-5%" y="-50%" width="110%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.22" numOctaves="4" seed="4" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                {/* Soot flecks */}
                <filter id="bnb-flecks" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="11" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -6.3" result="speck" />
                    <feComposite in="SourceGraphic" in2="speck" operator="in" />
                </filter>
                {/* Rough ember streak */}
                <filter id="bnb-streak" x="-5%" y="-300%" width="110%" height="700%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="3" seed="2" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* Film grain */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
                style={{ backgroundImage: GRAIN }}
            />

            {/* TOP EDGE: charred band with ragged lower edge + soot flecks (no glow) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28">
                <div className="absolute inset-x-0 -top-4 h-12 bg-[#050505]" style={{ filter: "url(#bnb-torn)" }} />
                <div
                    className="absolute inset-x-0 top-6 h-14 bg-[#050505]"
                    style={{
                        filter: "url(#bnb-flecks)",
                        WebkitMaskImage: "linear-gradient(to bottom, #000, transparent)",
                        maskImage: "linear-gradient(to bottom, #000, transparent)",
                    }}
                />
            </div>

            {/* BOTTOM EDGE: rough red ember streak */}
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 -z-10 h-3 w-[78%]">
                <div
                    className="h-full w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, #5e0f08 8%, #a8200d 32%, #c4421a 50%, #a8200d 64%, #6e140a 85%, transparent 100%)",
                        filter: "url(#bnb-streak)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 pt-20 sm:pb-24 sm:pt-32 md:pb-28 text-center">
                <motion.blockquote
                    initial={{ opacity: 0, scale: 0.95, y: 25 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <p
                        className={`${anton.className} text-balance uppercase leading-[1.08] tracking-[0.04em] text-[#EEEBDC] text-[clamp(1.9rem,5.6vw,4.4rem)]`}
                        style={{ filter: "url(#stamp-rough)" }}
                    >
                        &ldquo;Fire, smoke, and zero apologies.
                        <br className="hidden sm:block" /> Welcome to the smokehouse.&rdquo;
                    </p>
                </motion.blockquote>
            </div>
        </section>
    );
}