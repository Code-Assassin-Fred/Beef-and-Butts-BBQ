"use client";

import React, { useState, useEffect } from "react";
import { Anton, Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const displayFont = Anton({ subsets: ["latin"], weight: "400" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory?: string;
}

export default function QuoteModal({ isOpen, onClose, initialCategory }: QuoteModalProps) {
    const [form, setForm] = useState({
        eventType: initialCategory || "Weddings & Receptions",
        guestCount: "50-100",
        eventDate: "",
        name: "",
        email: "",
        phone: "",
        details: "",
    });

    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isOpen && initialCategory) {
            setForm((prev) => ({ ...prev, eventType: initialCategory }));
        }
    }, [isOpen, initialCategory]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");

        try {
            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("sent");
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`${bodyFont.className} fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto`}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f0f0f] border border-white/10 p-5 sm:p-8 shadow-2xl text-white my-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>

                        <div className="mb-5 sm:mb-6 text-center">
                            <h2 className={`${displayFont.className} text-xl sm:text-3xl uppercase tracking-wider text-[#FF8A3D]`}>
                                Request a BBQ Catering Quote
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                                Tell us about your event and we will craft a custom smoked barbecue feast for your guests.
                            </p>
                        </div>

                        {status === "sent" ? (
                            <div className="py-8 text-center space-y-4">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-2xl font-bold">
                                    ✓
                                </div>
                                <h3 className={`${displayFont.className} text-xl uppercase text-white`}>Quote Request Received!</h3>
                                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                                    Thank you, {form.name}! We will review your details for {form.eventType} and get back to you at {form.email} or {form.phone} within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setStatus("idle");
                                        onClose();
                                    }}
                                    className="mt-4 rounded-lg bg-[#FF8A3D] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#e0762a]"
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
                                {status === "error" && (
                                    <div className="rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-red-300 text-xs">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Event Type</label>
                                        <select
                                            name="eventType"
                                            value={form.eventType}
                                            onChange={handleChange}
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#FF8A3D]"
                                        >
                                            <option value="Weddings & Receptions" className="bg-[#0f0f0f]">Weddings & Receptions</option>
                                            <option value="Corporate Events" className="bg-[#0f0f0f]">Corporate Events</option>
                                            <option value="Private Parties & BBQs" className="bg-[#0f0f0f]">Private Parties & BBQs</option>
                                            <option value="Backyard Cookouts" className="bg-[#0f0f0f]">Backyard Cookouts</option>
                                            <option value="Festivals & Fairs" className="bg-[#0f0f0f]">Festivals & Fairs</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Guest Count</label>
                                        <select
                                            name="guestCount"
                                            value={form.guestCount}
                                            onChange={handleChange}
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#FF8A3D]"
                                        >
                                            <option value="20-50 guests" className="bg-[#0f0f0f]">20-50 guests</option>
                                            <option value="50-100 guests" className="bg-[#0f0f0f]">50-100 guests</option>
                                            <option value="100-200 guests" className="bg-[#0f0f0f]">100-200 guests</option>
                                            <option value="200+ guests" className="bg-[#0f0f0f]">200+ guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF8A3D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="john@example.com"
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF8A3D]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="(555) 000-0000"
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF8A3D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-neutral-300 font-semibold">Event Date</label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            value={form.eventDate}
                                            onChange={handleChange}
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#FF8A3D]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-neutral-300 font-semibold">Event Details & Special Requests</label>
                                    <textarea
                                        name="details"
                                        value={form.details}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tell us about location, preferred meats, dietary restrictions..."
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF8A3D]"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="w-full rounded-lg bg-[#FF8A3D] py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#e0762a] disabled:opacity-50"
                                >
                                    {status === "sending" ? "Submitting Request..." : "Submit Quote Request"}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
