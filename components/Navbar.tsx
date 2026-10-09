"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Jost, Kaushan_Script } from "next/font/google";

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
            className="relative -ml-6 flex shrink-0 flex-col items-center leading-none"
            style={{ color: BRAND_RED }}
        >
            <span
                className={`${script.className} -rotate-[4deg] text-[36px] lg:text-[42px]`}
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}
            >
                Beef &amp; Butts
            </span>
            <span
                className={`${jost.className} -mt-1 ml-6 self-start text-[18px] font-extrabold tracking-[0.04em] lg:text-[22px]`}
            >
                BAR-B-Q
            </span>
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
        // Check initial scroll position (e.g. after refresh mid-page)
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
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

            <div className="mx-auto flex h-[90px] items-center px-6 lg:h-[120px] lg:px-[5.7vw]">
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
                                    className="flex items-center gap-1.5 py-2 text-[14px] font-semibold uppercase tracking-[0.02em] xl:text-[15px]"
                                >
                                    {link.label}
                                    <Chevron open={dropdownOpen} />
                                </button>

                                {dropdownOpen && (
                                    <ul className="absolute left-0 top-full min-w-[220px] border border-white/10 bg-black/90 py-2 backdrop-blur">
                                        {link.children.map((child) => (
                                            <li key={child.label}>
                                                <Link
                                                    href={child.href}
                                                    className="block px-5 py-3 text-[17px] font-semibold uppercase tracking-[0.02em] hover:bg-white/10"
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="relative py-2 text-[14px] font-semibold uppercase tracking-[0.02em] xl:text-[15px]"
                            >
                                {link.label}
                                {link.active && (
                                    <span
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
                <Link
                    href="/order"
                    className="ml-auto hidden h-[48px] items-center px-[30px] text-[15px] font-semibold uppercase tracking-[0.02em] lg:flex"
                    style={{ backgroundColor: "#ff0000", color: "#1f8a7d" }}
                >
                    Order Now
                </Link>

                {/* Mobile toggle */}
                <button
                    type="button"
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((v) => !v)}
                    className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
                >
                    <span
                        className={`h-[2px] w-7 bg-white transition-transform ${mobileOpen ? "translate-y-[8px] rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`h-[2px] w-7 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""
                            }`}
                    />
                    <span
                        className={`h-[2px] w-7 bg-white transition-transform ${mobileOpen ? "-translate-y-[8px] -rotate-45" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <nav
                    aria-label="Mobile"
                    className="border-t border-white/10 bg-black/90 px-6 pb-6 backdrop-blur lg:hidden"
                >
                    <ul className="flex flex-col">
                        {links.flatMap((link) =>
                            link.children
                                ? link.children.map((c) => ({ ...c, active: false }))
                                : [link]
                        ).map((item) => (
                            <li key={item.label} className="border-b border-white/10">
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-4 text-lg font-semibold uppercase"
                                    style={item.active ? { color: ACCENT_ORANGE } : undefined}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/order"
                        onClick={() => setMobileOpen(false)}
                        className="mt-5 flex h-14 items-center justify-center text-lg font-semibold uppercase"
                        style={{ backgroundColor: "#ff0000", color: "#1f8a7d" }}
                    >
                        Order Now
                    </Link>
                </nav>
            )}
        </header>
    );
}