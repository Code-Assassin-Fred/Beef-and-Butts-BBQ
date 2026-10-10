"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Montserrat } from "next/font/google";
import QuoteModal from "./QuoteModal";

const serifFont = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], display: "swap" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

const videos = [
    "/Assets/seasoned-ribs-on-grill.mp4",
    "/Assets/slicing-smoked-brisket.mp4",
    "/Assets/spritzing-ribs-on-grill.mp4",
    "/Assets/unwrapping-smoked-brisket.mp4",
    "/Assets/curry-chip-dip.mp4",
    "/Assets/frying-bhajia.mp4",
];

type HeroSlide = {
    id: string;
    prefix: string;
    dynamicText: string;
    ctaText: string;
    ctaAction: "quote" | "menu";
    quoteCategory?: string;
};

const HERO_SLIDES: HeroSlide[] = [
    {
        id: "catering",
        prefix: "Meet Beef & Butts BBQ, your",
        dynamicText: "catering & events.",
        ctaText: "Get Quote",
        ctaAction: "quote",
        quoteCategory: "Corporate Events",
    },
    {
        id: "pickup",
        prefix: "Meet Beef & Butts BBQ, your",
        dynamicText: "pickup orders.",
        ctaText: "Go to Menu",
        ctaAction: "menu",
    },
    {
        id: "delivery",
        prefix: "Meet Beef & Butts BBQ, your",
        dynamicText: "doorstep delivery.",
        ctaText: "Go to Menu",
        ctaAction: "menu",
    },
    {
        id: "weddings",
        prefix: "Meet Beef & Butts BBQ, your",
        dynamicText: "weddings & receptions.",
        ctaText: "Get Quote",
        ctaAction: "quote",
        quoteCategory: "Weddings & Receptions",
    },
    {
        id: "corporate",
        prefix: "Meet Beef & Butts BBQ, your",
        dynamicText: "corporate functions.",
        ctaText: "Get Quote",
        ctaAction: "quote",
        quoteCategory: "Corporate Events",
    },
];

export default function Hero() {
    const [activeVideo, setActiveVideo] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Corporate Events");
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Play active background video
    useEffect(() => {
        videoRefs.current.forEach((video, i) => {
            if (!video) return;
            if (i === activeVideo) {
                video.currentTime = 0;
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        });
    }, [activeVideo]);

    const nextVideo = () => setActiveVideo((i) => (i + 1) % videos.length);

    // Dynamic text cycle timer (every 4.5 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    const currentSlide = HERO_SLIDES[slideIndex];

    const handleCtaClick = () => {
        if (currentSlide.ctaAction === "quote") {
            if (currentSlide.quoteCategory) {
                setSelectedCategory(currentSlide.quoteCategory);
            }
            setIsQuoteOpen(true);
        } else {
            const menuElem = document.getElementById("menu");
            if (menuElem) {
                menuElem.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <section id="home" className="relative h-screen min-h-[620px] w-full overflow-hidden bg-black">
            <h1 className="sr-only">Beef and Butts BBQ</h1>

            {/* Quote Modal */}
            <QuoteModal
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
                initialCategory={selectedCategory}
            />

            {/* Video stack: cross-fades from one clip to the next */}
            {videos.map((src, i) => (
                <video
                    key={src}
                    ref={(el) => {
                        videoRefs.current[i] = el;
                    }}
                    src={src}
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                    autoPlay={i === 0}
                    onEnded={i === activeVideo ? nextVideo : undefined}
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                        i === activeVideo ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            {/* Gradient Darkening overlays */}
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px] sm:h-[320px] bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Bottom-Left Floating Hero Content */}
            <div className={`${bodyFont.className} absolute bottom-14 sm:bottom-20 left-5 sm:left-10 md:left-14 lg:left-16 z-30 max-w-xl sm:max-w-2xl text-white`}>
                {/* Headline with dynamic changing word */}
                <div className="min-h-[110px] sm:min-h-[130px] flex flex-col justify-center">
                    <h2 className={`${serifFont.className} text-[clamp(2.5rem,5.5vw,4.8rem)] leading-[1.08] tracking-tight text-white drop-shadow-xl`}>
                        {currentSlide.prefix}{" "}
                        <div className="inline-block relative">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentSlide.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="inline-block italic text-white"
                                >
                                    {currentSlide.dynamicText}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </h2>
                </div>

                {/* Single Dynamic CTA Button */}
                <div className="mt-4 sm:mt-6">
                    <AnimatePresence mode="wait">
                        <motion.button
                            key={currentSlide.id}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.25 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCtaClick}
                            className="inline-flex h-11 sm:h-12 items-center justify-center gap-2.5 rounded-none bg-[#e4202b] px-6 sm:px-7 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-xl hover:bg-[#b81d24] transition-all cursor-pointer"
                        >
                            <span>{currentSlide.ctaText}</span>
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </motion.button>
                    </AnimatePresence>
                </div>
            </div>

            {/* Subtle animated scroll hint at bottom right */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="pointer-events-none absolute bottom-6 right-6 sm:right-12 z-30 hidden sm:flex flex-col items-center justify-center text-white/80"
            >
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 text-white/90 drop-shadow">
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="h-7 w-4.5 rounded-full border-2 border-white/60 p-1 flex justify-center"
                >
                    <div className="h-1.5 w-1 rounded-full bg-white" />
                </motion.div>
            </motion.div>
        </section>
    );
}

