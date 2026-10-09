"use client";

import Image from "next/image";
import Link from "next/link";
import { Anton, Jost } from "next/font/google";
import { motion } from "framer-motion";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

type Props = {
    image?: { src: string; alt: string };
    orderHref?: string;
};

export default function OrderBanner({
    image = {
        src: "/Assets/glazed-bbq-chicken.jpg",
        alt: "Glazed BBQ chicken with a dark, sticky char",
    },
    orderHref = "/order",
}: Props) {
    return (
        <section
            aria-labelledby="order-banner-heading"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-[#0a0a0a] text-white`}
        >
            {/* Shared SVG filter: distressed headline type */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="banner-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
            </svg>

            {/* Background photo */}
            <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="-z-10 object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/25" />

            <div className="mx-auto max-w-6xl px-4 sm:px-8 py-12 sm:py-16 md:py-28">
                {/* Translucent rust box */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="bg-[#C73A17]/90 px-5 sm:px-12 py-10 sm:py-14 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] md:px-20 md:py-20 rounded-sm"
                >
                    <h2
                        id="order-banner-heading"
                        className={`${displayFont.className} text-[clamp(1.9rem,5.2vw,4.5rem)] uppercase leading-[1.05] tracking-[0.03em]`}
                        style={{ filter: "url(#banner-stamp)" }}
                    >
                        Hot off the smoker.{" "}
                        <span className="inline-block -skew-x-12 text-[#FFD9B8]">At your door.</span>
                    </h2>

                    <p className="mx-auto mt-5 sm:mt-7 max-w-3xl text-[clamp(1rem,1.7vw,1.5rem)] leading-[1.6] text-white/95">
                        Brisket with a proper bark, ribs that slide off the bone, bhajia fried to a crackle. Order for
                        pickup or delivery and we&apos;ll bring the smokehouse to your table.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 sm:mt-10 inline-block"
                    >
                        <Link
                            href={orderHref}
                            className={`${displayFont.className} inline-block bg-[#1c1c1c] px-7 sm:px-9 py-3.5 sm:py-4 text-lg sm:text-xl uppercase tracking-[0.06em] text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white shadow-lg`}
                        >
                            Order now
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}