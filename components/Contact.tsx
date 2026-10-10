"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------ Content ------------------------------ */

const MAP_QUERY = "Ontario, Canada";
const MAP_ZOOM = 6;

const EMAIL = "hello@beefnbuttsbbq.com";
const PHONE_DISPLAY = "+1 647 889-8033";
const PHONE_HREF = "tel:+16478898033";
const LOCATION = "Ontario, Canada";

const DEFAULT_WHATSAPP = "https://wa.me/16478898033";

/* ------------------------------- Icons ------------------------------- */

const iconProps = {
    width: 24,
    height: 24,
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
    </svg>
);

/* ----------------------------- Component ----------------------------- */

type Props = {
    whatsappHref?: string;
};

export default function Contact({ whatsappHref = DEFAULT_WHATSAPP }: Props) {
    const [mapActive, setMapActive] = useState(false);
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=${MAP_ZOOM}&output=embed`;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setStatus("sent");
                (e.target as HTMLFormElement).reset();
            } else {
                const data = await res.json();
                setStatus("error");
                setErrorMessage(data.error || "Failed to send message. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
        }
    };

    return (
        <section id="contact" aria-label="Contact">
            <div className="grid bg-white lg:grid-cols-[20%_80%]">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center gap-6 sm:gap-7 px-5 py-8 sm:px-10 lg:px-8 lg:py-0"
                >
                    <div>
                        <h3 className="text-base font-bold text-black">Email Us</h3>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="mt-1.5 block break-words text-sm text-neutral-700 underline-offset-2 hover:underline"
                        >
                            {EMAIL}
                        </a>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-black">Call Us</h3>
                        <a
                            href={PHONE_HREF}
                            className="mt-1.5 block text-sm text-neutral-700 underline-offset-2 hover:underline"
                        >
                            {PHONE_DISPLAY}
                        </a>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-black">Our Location</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">{LOCATION}</p>
                    </div>
                </motion.div>

                <div
                    className="relative h-[250px] sm:h-[340px] w-full overflow-hidden bg-neutral-200 lg:h-[400px]"
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
                            <span className="px-5 text-center text-lg sm:text-xl text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 font-semibold">
                                Click to explore the map
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-[#F1F1EF] text-black">
                <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 py-10 sm:px-8 sm:py-14 md:px-10 md:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-14">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.05] tracking-tight">
                            Get in Touch
                        </h2>
                        <p className="mt-4 sm:mt-5 max-w-sm text-sm sm:text-base leading-[1.6] text-neutral-800">
                            Have questions, or want to talk through an order or a catering booking? Drop us a line.
                        </p>

                        <ul className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4 text-[#1B3A4B]">
                            <li className="flex items-center gap-3.5">
                                <ClockIcon />
                                <span className="text-sm sm:text-base font-bold text-black">24 hour reply time</span>
                            </li>
                            <li className="flex items-center gap-3.5">
                                <HeadsetIcon />
                                <span className="text-sm sm:text-base font-bold text-black">Personal assistance</span>
                            </li>
                        </ul>

                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#25D366] transition-colors hover:text-[#1FB858] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                        >
                            <ChatIcon />
                            Chat with us on WhatsApp
                        </a>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex flex-col"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <label className="block">
                                <span className="text-xs sm:text-sm font-bold">Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Your name"
                                    autoComplete="name"
                                    className="mt-1.5 sm:mt-2 block w-full rounded-xl border-0 bg-[#F6F6F4] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                                />
                            </label>
                            <label className="block">
                                <span className="text-xs sm:text-sm font-bold">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="mt-1.5 sm:mt-2 block w-full rounded-xl border-0 bg-[#F6F6F4] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                                />
                            </label>
                        </div>

                        <label className="mt-4 sm:mt-5 block">
                            <span className="text-xs sm:text-sm font-bold">Message</span>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Hello, I'd like to ask about..."
                                className="mt-1.5 sm:mt-2 block min-h-[110px] sm:min-h-[130px] w-full resize-y rounded-xl border-0 bg-[#F6F6F4] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline focus:outline-2 focus:outline-[#1B3A4B]"
                            />
                        </label>

                        {status === "error" && (
                            <p className="mt-3 text-xs sm:text-sm text-red-600 font-semibold">{errorMessage}</p>
                        )}

                        <div className="mt-6 flex flex-col items-stretch sm:items-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={status === "sending"}
                                className="rounded-lg bg-black px-7 sm:px-9 py-3 sm:py-3.5 text-base sm:text-lg font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.22)] ring-4 ring-white/70 transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black disabled:opacity-50"
                            >
                                {status === "sending" ? "Sending..." : "Send message"}
                            </motion.button>
                            <p role="status" aria-live="polite" className="min-h-5 text-xs sm:text-sm text-neutral-700 font-medium text-center sm:text-right">
                                {status === "sent" ? "Thanks! Your message has been sent." : ""}
                            </p>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}