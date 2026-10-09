"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Anton, Jost } from "next/font/google";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

/* ------------------------------ Content ------------------------------ */

const PARAGRAPHS = [
    "Beef N Butts BBQ was built on a simple idea: real barbecue takes time, and it is worth every minute. We cook over fire and slow smoke until the brisket gives up, the ribs wear a deep, sticky bark, and the chicken comes off the grill glazed and a little bit charred.",
    "We also like to play with our food. Crispy bhajia with chilli sauce, curry chip dip, and smoked ribs share the same table here, classic pit flavor with a twist you won't find at the next smokehouse.",
    "Pick it up, have it delivered, or let us bring the pit to your next event. However it reaches you, it leaves our fire hot and loud.",
];

const GALLERY_TITLE = "Pit-Fired. Plate-Ready.";
const GALLERY_TEXT =
    "Bark-crusted ribs, glazed chicken and bhajia with a kick of chilli: a look at what leaves our smoker and fryer every day.";

type GalleryItem = { id?: string; name: string; src: string; alt: string };

const DEFAULT_GALLERY: GalleryItem[] = [
    { name: "Ribs & Bhajia", src: "/Assets/bbq-ribs-with-bhajia.jpg", alt: "BBQ ribs served with crispy bhajia" },
    { name: "Bhajia & Chilli Sauce", src: "/Assets/bhajia-with-chilli-sauce.jpg", alt: "Crispy bhajia with chilli sauce" },
    { name: "Curry & Tortilla Chips", src: "/Assets/curry-with-tortilla-chips.jpg", alt: "Curry dip with tortilla chips" },
    { name: "Glazed BBQ Chicken", src: "/Assets/glazed-bbq-chicken.jpg", alt: "Glazed BBQ chicken fresh off the grill" },
    { name: "Clean Plate", src: "/Assets/munched.jpg", alt: "A plate cleared after a BBQ meal" },
    { name: "Seasoned Rib Racks", src: "/Assets/seasoned-rib-racks-raw.jpg", alt: "Seasoned raw rib racks ready for the smoker" },
    { name: "Sliced Brisket & Greens", src: "/Assets/sliced-brisket-with-greens.jpg", alt: "Sliced smoked brisket served with greens" },
    { name: "Fresh Tortilla Chips", src: "/Assets/tortilla-chips-prep.jpg", alt: "Tortilla chips being prepared" },
];

/* ------------------------------ Texture ------------------------------ */

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

/* ----------------------------- Component ----------------------------- */

type Props = {
    heroImage?: { src: string; alt: string };
};

export default function About({
    heroImage = {
        src: "/Assets/sliced-brisket-with-greens.jpg",
        alt: "Sliced smoked brisket served with greens",
    },
}: Props) {
    const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);

    useEffect(() => {
        let isMounted = true;
        async function fetchGallery() {
            try {
                const res = await fetch("/api/gallery");
                if (res.ok) {
                    const data = await res.json();
                    if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
                        const items: GalleryItem[] = data.photos.map((p: any) => ({
                            id: p.id,
                            name: p.caption || p.name || "Beef N' Butts BBQ",
                            src: p.src || p.imageBase64,
                            alt: p.caption || "BBQ Gallery Photo",
                        }));
                        if (isMounted) {
                            setGallery(items);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch gallery photos from API, using defaults:", err);
            }
        }
        fetchGallery();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="about-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
            </svg>

            <section
                aria-labelledby="about-heading"
                className={`${bodyFont.className} relative isolate bg-[#0a0a0a] text-white`}
                style={{ clipPath: "inset(0)" }}
            >
                <div aria-hidden="false" className="fixed inset-0 -z-10 motion-reduce:absolute">
                    <Image
                        src={heroImage.src}
                        alt={heroImage.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
                </div>

                <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 text-center sm:px-10 md:pt-20 md:pb-28">
                    <motion.h1
                        id="about-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className={`${displayFont.className} text-[clamp(1.75rem,4.2vw,4rem)] uppercase leading-[1.08] sm:leading-[1.05] tracking-[0.02em] md:whitespace-nowrap`}
                        style={{ filter: "url(#about-stamp)" }}
                    >
                        Smoked slow. Served with{" "}
                        <span className="relative inline-block text-[#FF8A3D] after:absolute after:inset-x-0 after:-bottom-1.5 sm:after:-bottom-2 after:h-[3px] after:bg-[#FF8A3D]">
                            swagger
                        </span>
                        .
                    </motion.h1>

                    <div className="mt-10 sm:mt-14 space-y-6 sm:space-y-8 text-[clamp(1rem,1.8vw,1.6rem)] leading-[1.65] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)] md:mt-16 md:space-y-10">
                        {PARAGRAPHS.map((p, i) => (
                            <motion.p
                                key={p}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="mx-auto max-w-6xl text-white/95"
                            >
                                {p}
                            </motion.p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Gallery: fetched from Firestore database ===== */}
            <section
                aria-labelledby="gallery-heading"
                className={`${bodyFont.className} relative z-10 isolate bg-white`}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply"
                    style={{
                        backgroundImage: `${FLECKS}, ${MOTTLE}, ${GRAIN}`,
                        backgroundSize: "300px 300px, 600px 600px, 200px 200px",
                    }}
                />

                <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-8 md:pt-14 md:pb-24">
                    <motion.header
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <h2
                            id="gallery-heading"
                            className={`${displayFont.className} text-[clamp(2rem,5vw,4rem)] uppercase leading-[1.05] tracking-[0.02em] text-[#0f0f0f]`}
                            style={{ filter: "url(#about-stamp)" }}
                        >
                            {GALLERY_TITLE}
                        </h2>
                        <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-neutral-700 md:text-xl">{GALLERY_TEXT}</p>
                    </motion.header>

                    <ul className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 md:mt-16">
                        {gallery.map((item, index) => (
                            <motion.li
                                key={item.id || `${item.src}-${index}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                            >
                                <figure className="group relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#0f0f0f] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                                    <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                                        <span
                                            className={`${displayFont.className} block text-[1.4rem] sm:text-[1.6rem] uppercase leading-tight tracking-[0.04em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] lg:text-[1.75rem]`}
                                        >
                                            {item.name}
                                        </span>
                                    </figcaption>
                                </figure>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}