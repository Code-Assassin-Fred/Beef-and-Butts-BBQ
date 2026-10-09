"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Jost, Kaushan_Script } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

// Nav font: Jost (geometric uppercase sans, same look as shortys.com nav)
const jost = Jost({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    display: "swap",
});

// Logo script lettering (closest Google Font to the brush-script wordmark)
const script = Kaushan_Script({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const BRAND_RED = "#e4202b";
const ACCENT_ORANGE = "#e8742a";

type NavLink = { label: string; href: string; active: boolean };
type NavGroup = { label: string; href: string; active: boolean; children?: NavLink[] };

const links: NavGroup[] = [
    { label: "Home", href: "/", active: true },
    { label: "Catering", href: "/catering", active: false },
    {
        label: "Locations & Menus",
        href: "#",
        active: false,
        children: [
            { label: "Locations", href: "/locations", active: false },
            { label: "Menus", href: "/menu", active: false },
        ],
    },
    { label: "Rewards", href: "/rewards", active: false },
    { label: "Gift Cards", href: "/gift-cards", active: false },
    { label: "Contact Us", href: "/contact", active: false },
];

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function Logo() {
    return (
        <Link
            href="/"
            aria-label="Beef and Butts BBQ home"
            className="relative -ml-2 sm:-ml-6 flex shrink-0 flex-col items-center leading-none"
            style={{ color: BRAND_RED }}
        >
            <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`${script.className} -rotate-[4deg] text-[30px] sm:text-[36px] lg:text-[42px]`}
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}
            >
                Beef &amp; Butts
            </motion.span>
            <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`${jost.className} -mt-1 ml-4 sm:ml-6 self-start text-[15px] sm:text-[18px] font-extrabold tracking-[0.04em] lg:text-[22px]`}
            >
                BAR-B-Q
            </motion.span>
        </Link>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${jost.className} inset-x-0 top-0 z-50 text-white transition-all duration-300 ${
                scrolled
                    ? "fixed border-b border-white/10 bg-black/80 shadow-lg backdrop-blur-md"
                    : "absolute border-b border-white/10 bg-transparent"
            }`}
        >
            {/* Soft top shade so the transparent nav stays readable over bright footage */}
            {!scrolled && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
                />
            )}

            <div className="mx-auto flex h-[76px] sm:h-[90px] items-center px-4 sm:px-6 lg:h-[120px] lg:px-[5.7vw]">
                <Logo />

                {/* Desktop links */}
                <nav
                    aria-label="Primary"
                    className="ml-8 hidden items-center gap-[1.6vw] lg:flex xl:ml-10"
                >
                    {links.map((link) =>
                        link.children ? (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button
                                    type="button"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen}
                                    onClick={() => setDropdownOpen((v) => !v)}
                                    className="flex items-center gap-1.5 py-2 text-[14px] font-semibold uppercase tracking-[0.02em] xl:text-[15px] hover:text-[#e8742a] transition-colors"
                                >
                                    {link.label}
                                    <Chevron open={dropdownOpen} />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 top-full min-w-[220px] border border-white/10 bg-black/90 py-2 backdrop-blur shadow-xl"
                                        >
                                            {link.children.map((child) => (
                                                <li key={child.label}>
                                                    <Link
                                                        href={child.href}
                                                        className="block px-5 py-3 text-[17px] font-semibold uppercase tracking-[0.02em] hover:bg-white/10 hover:text-[#e8742a] transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="relative py-2 text-[14px] font-semibold uppercase tracking-[0.02em] xl:text-[15px] hover:text-[#e8742a] transition-colors"
                            >
                                {link.label}
                                {link.active && (
                                    <motion.span
                                        layoutId="activeNavIndicator"
                                        aria-hidden="true"
                                        className="absolute inset-x-0 -bottom-[2px] h-[2px]"
                                        style={{ backgroundColor: ACCENT_ORANGE }}
                                    />
                                )}
                            </Link>
                        )
                    )}
                </nav>

                {/* Order Now */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-auto hidden lg:block"
                >
                    <Link
                        href="/order"
                        className="flex h-[48px] items-center px-[30px] text-[15px] font-semibold uppercase tracking-[0.02em] shadow-md transition-shadow hover:shadow-lg"
                        style={{ backgroundColor: "#ff0000", color: "#1f8a7d" }}
                    >
                        Order Now
                    </Link>
                </motion.div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((v) => !v)}
                    className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                >
                    <span
                        className={`h-[2px] w-7 bg-white transition-all duration-300 ${
                            mobileOpen ? "translate-y-[8px] rotate-45" : ""
                        }`}
                    />
                    <span
                        className={`h-[2px] w-7 bg-white transition-opacity duration-300 ${
                            mobileOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`h-[2px] w-7 bg-white transition-all duration-300 ${
                            mobileOpen ? "-translate-y-[8px] -rotate-45" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Mobile menu animated drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        aria-label="Mobile"
                        className="overflow-hidden border-t border-white/10 bg-black/95 px-5 sm:px-6 pb-6 backdrop-blur-lg lg:hidden"
                    >
                        <motion.ul
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
                            }}
                            className="flex flex-col"
                        >
                            {links.flatMap((link) =>
                                link.children
                                    ? link.children.map((c) => ({ ...c, active: false }))
                                    : [link]
                            ).map((item) => (
                                <motion.li
                                    key={item.label}
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: -10 }
                                    }}
                                    className="border-b border-white/10"
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-3.5 sm:py-4 text-base sm:text-lg font-semibold uppercase tracking-wider transition-colors hover:text-[#e8742a]"
                                        style={item.active ? { color: ACCENT_ORANGE } : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                href="/order"
                                onClick={() => setMobileOpen(false)}
                                className="mt-5 flex h-12 sm:h-14 items-center justify-center text-base sm:text-lg font-semibold uppercase tracking-wider rounded shadow-lg active:scale-[0.98] transition-transform"
                                style={{ backgroundColor: "#ff0000", color: "#1f8a7d" }}
                            >
                                Order Now
                            </Link>
                        </motion.div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}