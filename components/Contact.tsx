"use client";

import { useState } from "react";

/* ------------------------------ Content ------------------------------ */

// TODO: confirm with the client. Swap the query for the exact restaurant address once it is known,
// e.g. "123 Main St E, Hamilton, ON" and raise the zoom (z=15).
const MAP_QUERY = "Ontario, Canada";
const MAP_ZOOM = 6;

// TODO: replace with the real WhatsApp number in international format, digits only (wa.me/<number>).
const DEFAULT_WHATSAPP = "https://wa.me/";

/* ------------------------------- Icons ------------------------------- */

const iconProps = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const ClockIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="12" r="9.25" />
        <path d="M12 6.5V12l3.5 2" />
    </svg>
);

const HeadsetIcon = () => (
    <svg {...iconProps}>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
        <path d="M4 15a1.5 1.5 0 0 1 1.5-1.5h.5a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-.5A1.5 1.5 0 0 1 4 17.5V15Z" />
        <path d="M20 15a1.5 1.5 0 0 0-1.5-1.5H18a1 1 0 0 0-1 1V18a1 1 0 0 0 1 1h.5a1.5 1.5 0 0 0 1.5-1.5V15Z" />
    </svg>
);

const ChatIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
    </svg>
);

/* ----------------------------- Component ----------------------------- */

type Props = {
    whatsappHref?: string;
};

export default function Contact({ whatsappHref = DEFAULT_WHATSAPP }: Props) {
    // The embedded map ignores the page scroll until the visitor clicks it (stops accidental zooming).
    const [mapActive, setMapActive] = useState(false);
    const [sent, setSent] = useState(false);

    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=${MAP_ZOOM}&output=embed`;

    return (
        <section aria-label="Contact">
            {/* ===== 1. Map ===== */}
            <div
                className="relative h-[380px] w-full overflow-hidden bg-neutral-200 sm:h-[520px] lg:h-[680px]"
                onMouseLeave={() => setMapActive(false)}
            >
                <iframe
                    title="Map of Ontario, Canada"
                    src={mapSrc}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />

                {!mapActive && (
                    <button
                        type="button"
                        onClick={() => setMapActive(true)}
                        aria-label="Click to interact with the map"
                        className="group absolute inset-0 flex items-center justify-center bg-transparent transition-colors hover:bg-black/55 focus-visible:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                    >
                        <span className="px-6 text-center text-2xl font-normal text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-3xl">
                            Click to explore the map
                        </span>
                    </button>
                )}
            </div>

            {/* ===== 2. Get in touch ===== */}
            <div className="bg-[#F1F1EF] text-black">
                <div className="grid gap-14 px-6 py-16 md:px-[60px] md:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.55fr)] lg:gap-16">
                    {/* Left: copy */}
                    <div>
                        <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
                            Get in Touch
                        </h2>
                        <p className="mt-9 max-w-[34rem] text-[1.35rem] leading-[1.6] text-neutral-800">
                            Have questions, or want to talk through an order or a catering booking? Drop us a line.
                        </p>

                        <ul className="mt-12 space-y-7 text-[#1B3A4B]">
                            <li className="flex items-center gap-5">
                                <ClockIcon />
                                <span className="text-[1.35rem] font-bold text-black">24 hour reply time</span>
                            </li>
                            <li className="flex items-center gap-5">
                                <HeadsetIcon />
                                <span className="text-[1.35rem] font-bold text-black">Personal assistance</span>
                            </li>
                        </ul>

                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-[#1FB858] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
                        >
                            <ChatIcon />
                            Chat with us on WhatsApp
                        </a>
                    </div>

                    {/* Right: form */}
                    <form
                        className="flex flex-col"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // TODO: wire to the real endpoint (API route, Formspree, Resend, etc.).
                            setSent(true);
                        }}
                    >
                        <div className="grid gap-6 sm:grid-cols-2 sm:gap-9">
                            <label className="block">
                                <span className="text-lg font-bold">Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Your name"
                                    autoComplete="name"
                                    className="mt-3.5 block w-full rounded-2xl border-0 bg-[#F6F6F4] px-6 py-5 text-xl text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                                />
                            </label>
                            <label className="block">
                                <span className="text-lg font-bold">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="mt-3.5 block w-full rounded-2xl border-0 bg-[#F6F6F4] px-6 py-5 text-xl text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                                />
                            </label>
                        </div>

                        <label className="mt-9 block">
                            <span className="text-lg font-bold">Message</span>
                            <textarea
                                name="message"
                                required
                                rows={6}
                                placeholder="Hello, I'd like to ask about..."
                                className="mt-3.5 block min-h-[190px] w-full resize-y rounded-2xl border-0 bg-[#F6F6F4] px-6 py-5 text-xl text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                            />
                        </label>

                        <div className="mt-10 flex flex-col items-end gap-4">
                            {/* Only the colour differs from the reference: hickory brown instead of navy. */}
                            <button
                                type="submit"
                                className="rounded-lg bg-[#5A2E1A] px-14 py-5 text-2xl font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] ring-[6px] ring-white/70 transition-colors hover:bg-[#46230F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[8px] focus-visible:outline-[#5A2E1A]"
                            >
                                Send message
                            </button>
                            <p role="status" aria-live="polite" className="min-h-6 text-base text-neutral-700">
                                {sent ? "Thanks, we'll reply within 24 hours." : ""}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}