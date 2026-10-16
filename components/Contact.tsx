"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------ Content ------------------------------ */

const MAP_QUERY = "108 Adair Ave S, Hamilton, ON L8K 3S5, Canada";
const MAP_ZOOM = 17;
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/108+Adair+Ave+S,+Hamilton,+ON+L8K+3S5,+Canada/@43.232651,-79.7917752,17z/data=!3m1!4b1!4m6!3m5!1s0x882c991b954b58a3:0x513e9dfef099f98c!8m2!3d43.232651!4d-79.7917752!16s%2Fg%2F11c248_s8b";

const EMAIL = "beefnbuttsbbq@gmail.com";
const PHONE_DISPLAY = "+1 647 889-8033";
const PHONE_HREF = "tel:+16478898033";
const LOCATION_LINE1 = "108 Adair Ave S";
const LOCATION_LINE2 = "Hamilton, Ontario L8K 3S5";

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
                    className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:flex lg:flex-col justify-center lg:gap-7 px-5 py-8 sm:px-10 lg:px-8 lg:py-0"
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
                        <a
                            href={GOOGLE_MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 block text-sm leading-relaxed text-neutral-700 hover:text-[#e4202b] transition-colors"
                        >
                            {LOCATION_LINE1}<br />
                            {LOCATION_LINE2}
                        </a>
                    </div>
                </motion.div>

                <div
                    className="relative h-[250px] sm:h-[340px] w-full overflow-hidden bg-neutral-200 lg:h-[400px]"
                    onMouseLeave={() => setMapActive(false)}
                >
                    <iframe
                        title="Map of 108 Adair Ave S, Hamilton, ON"
                        src={mapSrc}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />

                    <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 z-10 rounded bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-md hover:bg-white hover:text-[#e4202b] transition-all flex items-center gap-1.5"
                    >
                        <span>Open in Google Maps</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>

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
                        <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.05] tracking-tight text-center lg:text-left">
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

                        <div className="mt-6 flex flex-col items-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={status === "sending"}
                                className="w-auto rounded-lg bg-black px-7 sm:px-9 py-3 sm:py-3.5 text-base sm:text-lg font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.22)] ring-4 ring-white/70 transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black disabled:opacity-50"
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