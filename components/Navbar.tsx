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

type NavItem = { label: string; href: string; id: string };

const links: NavItem[] = [
    { label: "Home", href: "#home", id: "home" },
    { label: "Menus", href: "#menu", id: "menu" },
    { label: "Catering", href: "#catering", id: "catering" },
    { label: "About", href: "#about", id: "about" },
    { label: "From Our Kitchen", href: "#gallery", id: "gallery" },
    { label: "Contact", href: "#contact", id: "contact" },
];

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
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sectionIds = ["home", "menu", "catering", "about", "gallery", "contact"];
            const scrollPos = window.scrollY + 150;

            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#") || href.startsWith("/#")) {
            e.preventDefault();
            const targetId = href.replace(/^(\/#|#)/, "");
            if (!targetId || targetId === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const elem = document.getElementById(targetId);
                if (elem) {
                    const headerOffset = 80;
                    const elementPosition = elem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        }
    };

    return (
        <motion.header
            initial={{ y: -120, opacity: 0 }}
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

            <div className="mx-auto flex h-[125px] sm:h-[90px] items-center px-4 sm:px-6 lg:h-[120px] lg:px-[5.7vw] justify-between">
                <div className="flex shrink-0 items-center justify-start min-w-[200px] xl:min-w-[240px]">
                    <Logo />
                </div>

                {/* Desktop links */}
                <nav
                    aria-label="Primary"
                    className="hidden items-center justify-center gap-7 lg:flex flex-1 mx-4 xl:gap-11"
                >
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="relative py-2 text-[14px] font-semibold uppercase tracking-[0.02em] xl:text-[15px] hover:text-[#e4202b] transition-colors cursor-pointer"
                        >
                            {link.label}
                            {activeSection === link.id && (
                                <motion.span
                                    layoutId="activeNavIndicator"
                                    aria-hidden="true"
                                    className="absolute inset-x-0 -bottom-[2px] h-[2px]"
                                    style={{ backgroundColor: BRAND_RED }}
                                />
                            )}
                        </a>
                    ))}
                </nav>

                {/* Order Now */}
                <div className="hidden lg:flex shrink-0 items-center justify-end min-w-[200px] xl:min-w-[240px]">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <a
                            href="#menu"
                            onClick={(e) => handleNavClick(e, "#menu")}
                            className="flex h-[48px] items-center px-[30px] text-[15px] font-semibold uppercase tracking-[0.02em] shadow-md transition-shadow hover:shadow-lg cursor-pointer"
                            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
                        >
                            Order Now
                        </a>
                    </motion.div>
                </div>

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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        aria-label="Mobile"
                        className="absolute top-full right-0 w-[65%] overflow-hidden border-t border-l border-white/10 bg-black/95 px-5 pb-6 backdrop-blur-lg shadow-2xl lg:hidden z-50"
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
                            {links.map((item) => (
                                <motion.li
                                    key={item.label}
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: -10 }
                                    }}
                                    className="border-b border-white/10"
                                >
                                    <a
                                        href={item.href}
                                        onClick={(e) => {
                                            handleNavClick(e, item.href);
                                            setMobileOpen(false);
                                        }}
                                        className="block py-3.5 sm:py-4 text-base sm:text-lg font-semibold uppercase tracking-wider transition-colors hover:text-[#e4202b] cursor-pointer"
                                        style={activeSection === item.id ? { color: BRAND_RED } : undefined}
                                    >
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <a
                                href="#menu"
                                onClick={(e) => {
                                    handleNavClick(e, "#menu");
                                    setMobileOpen(false);
                                }}
                                className="mt-5 flex h-12 sm:h-14 items-center justify-center text-base sm:text-lg font-semibold uppercase tracking-wider rounded shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
                                style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
                            >
                                Order Now
                            </a>
                        </motion.div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}