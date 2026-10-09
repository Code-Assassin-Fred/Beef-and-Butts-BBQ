"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
    "/Assets/seasoned-ribs-on-grill.mp4",
    "/Assets/slicing-smoked-brisket.mp4",
    "/Assets/spritzing-ribs-on-grill.mp4",
    "/Assets/unwrapping-smoked-brisket.mp4",
    "/Assets/curry-chip-dip.mp4",
    "/Assets/frying-bhajia.mp4",
];

export default function Hero() {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLVideoElement | null)[]>([]);

    // Play the active clip, rewind and pause the others
    useEffect(() => {
        refs.current.forEach((video, i) => {
            if (!video) return;
            if (i === active) {
                video.currentTime = 0;
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        });
    }, [active]);

    const next = () => setActive((i) => (i + 1) % videos.length);

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
            <h1 className="sr-only">Beef and Butts BBQ</h1>

            {/* Video stack: cross-fades from one clip to the next */}
            {videos.map((src, i) => (
                <video
                    key={src}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                    src={src}
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                    autoPlay={i === 0}
                    onEnded={i === active ? next : undefined}
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            {/* Darkening so the transparent nav and footage stay readable */}
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-gradient-to-b from-black/80 to-transparent" />

            {/* Accessibility tools, left edge */}
            <div className="absolute left-0 top-[410px] z-40 hidden flex-col overflow-hidden rounded-r-md bg-white shadow-md md:flex">
                <button
                    type="button"
                    aria-label="Toggle high contrast"
                    onClick={() => document.documentElement.classList.toggle("contrast-125")}
                    className="flex h-[60px] w-[60px] items-center justify-center border-b border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
                    </svg>
                </button>
                <button
                    type="button"
                    aria-label="Increase text size"
                    onClick={() => {
                        const el = document.documentElement;
                        const size = parseFloat(getComputedStyle(el).fontSize);
                        el.style.fontSize = `${size >= 20 ? 16 : size + 2}px`;
                    }}
                    className="flex h-[60px] w-[60px] items-center justify-center text-neutral-900 hover:bg-neutral-100"
                >
                    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2 8h9v2.5H8.2V20H5V10.5H2zM11 4h11v3h-4v13h-3.2V7H11z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </section>
    );
}