"use client";

import { useId, useMemo, useState, useEffect } from "react";
import { Anton, Montserrat, Great_Vibes } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });

/* ----------------------------- Types & Defaults ----------------------------- */

type MenuItem = {
    id: string;
    name: string;
    price: number | string; // CAD or formatted string
    description?: string;
};

type Category = {
    id: string;
    title: string;
    items: MenuItem[];
};

const DEFAULT_CATEGORIES: Category[] = [
    {
        id: "meats",
        title: "Smoked Meats & Platters",
        items: [
            { id: "brisket", name: "BBQ Beef Brisket", price: 18, description: "Slow-smoked over hardwood for 14 hours." },
            { id: "chicken-leg", name: "BBQ Chicken Leg", price: 13, description: "Glazed and wood-fired chicken leg." },
            { id: "half-rack", name: "1/2 Rack Pork Ribs", price: 20, description: "Tender St. Louis cut ribs." },
            { id: "full-rack", name: "Full Rack Pork Ribs", price: 35, description: "Full rack of fall-off-the-bone smoked ribs." },
            { id: "pulled-pork", name: "Pulled Pork Sandwich", price: 16, description: "Hickory-smoked pulled pork on brioche." },
            {
                id: "farmers-sausage",
                name: "Smoked Farmers Sausage",
                price: 14,
                description: "Snap-casing sausage link served with mustard.",
            },
            {
                id: "pitmaster-combo",
                name: "The Pitmaster Combo",
                price: 55,
                description: "Feeds 2. Brisket, pork ribs and two small sides.",
            },
            {
                id: "feast-platter",
                name: "The Feast Platter",
                price: 90,
                description: "Feeds 4. A full rack, brisket, chicken legs and large sides.",
            },
        ],
    },
    {
        id: "sides",
        title: "Classic Sides",
        items: [
            { id: "coleslaw", name: "Coleslaw", price: 6, description: "Fresh and crunchy house coleslaw." },
            {
                id: "pit-beans",
                name: "Baked Pit Beans",
                price: 5,
                description: "Slow-cooked with brisket burnt ends.",
            },
            { id: "mac", name: "Creamy Mac & Cheese", price: 6, description: "Baked four-cheese mac." },
            { id: "cornbread", name: "Cornbread with Honey Butter", price: 5, description: "Warm cornbread with honey butter." },
            { id: "fries", name: "French Fries", price: 5, description: "Golden crispy seasoned fries." },
            {
                id: "poutine",
                name: "Smoked BBQ Poutine",
                price: 12,
                description: "Fries topped with fresh cheese curds, gravy and brisket.",
            },
        ],
    },
    {
        id: "drinks",
        title: "Drinks",
        items: [
            { id: "sprite", name: "Sprite", price: 1.5 },
            { id: "fanta", name: "Fanta", price: 1.5 },
            { id: "coke", name: "Coke", price: 1.5 },
            { id: "diet-coke", name: "Diet Coke", price: 1.5 },
            { id: "ginger-ale", name: "Canada Dry Ginger Ale", price: 1.5 },
            { id: "root-beer", name: "Root Beer", price: 1.5 },
        ],
    },
];

const SERVICE_OPTIONS = [
    { label: "Pickup", text: "Swing by and grab it hot off the pit." },
    { label: "Delivery", text: "We'll bring the smoke to your door." },
];

export type CartLine = { item: MenuItem; quantity: number };

/* ------------------------------ Helpers ------------------------------ */

const parseNumericPrice = (p: number | string): number => {
    if (typeof p === "number") return p;
    if (!p) return 0;
    return parseFloat(p.toString().replace("$", ""));
};

const money = (n: number | string) => {
    const num = parseNumericPrice(n);
    return Number.isInteger(num) ? `$${num}` : `$${num.toFixed(2)}`;
};

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const ORANGE = "text-[#FF8A3D]";
const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EEEBDC]";

/* ------------------------------ Component ----------------------------- */

type MenuProps = {
    onCartChange?: (lines: CartLine[]) => void;
    onCheckout?: (lines: CartLine[]) => void;
};

export default function Menu({ onCartChange, onCheckout }: MenuProps) {
    const baseId = useId();
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<Set<string>>(new Set(["meats"]));

    // Integration with global CartContext
    const { cart: globalCart, addToCart, updateQty: updateGlobalQty } = useCart();

    useEffect(() => {
        let isMounted = true;
        async function fetchMenu() {
            try {
                const res = await fetch("/api/menu");
                if (res.ok) {
                    const data = await res.json();
                    if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
                        const formattedCats: Category[] = data.categories.map((c: any, index: number) => ({
                            id: c.id || `cat-${index}`,
                            title: c.title,
                            items: (c.items || []).map((item: any, iIdx: number) => ({
                                id: item.id || `item-${index}-${iIdx}`,
                                name: item.name,
                                price: item.price,
                                description: item.description || "",
                            })),
                        }));
                        if (isMounted) {
                            setCategories(formattedCats);
                            if (formattedCats.length > 0) {
                                setOpen(new Set([formattedCats[0].id]));
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch menu from API, using defaults:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchMenu();
        return () => {
            isMounted = false;
        };
    }, []);

    const getItemQty = (name: string) => {
        const found = globalCart.find((ci) => ci.name === name);
        return found ? found.qty : 0;
    };

    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    return (
        <section
            id="menu"
            aria-label="Menu"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#131313] to-[#1c1c1c] text-[#EEEBDC]`}
        >
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="menu-torn" x="-5%" y="-50%" width="110%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.22" numOctaves="4" seed="4" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="menu-flecks" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="11" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -6.3" result="speck" />
                    <feComposite in="SourceGraphic" in2="speck" operator="in" />
                </filter>
                <filter id="menu-streak" x="-5%" y="-300%" width="110%" height="700%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="3" seed="2" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
                style={{ backgroundImage: GRAIN }}
            />

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28">
                <div className="absolute inset-x-0 -top-4 h-12 bg-[#050505]" style={{ filter: "url(#menu-torn)" }} />
                <div
                    className="absolute inset-x-0 top-6 h-14 bg-[#050505]"
                    style={{
                        filter: "url(#menu-flecks)",
                        WebkitMaskImage: "linear-gradient(to bottom, #000, transparent)",
                        maskImage: "linear-gradient(to bottom, #000, transparent)",
                    }}
                />
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 -z-10 h-3 w-[78%]">
                <div
                    className="h-full w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, #5e0f08 8%, #a8200d 32%, #c4421a 50%, #a8200d 64%, #6e140a 85%, transparent 100%)",
                        filter: "url(#menu-streak)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-8 pb-20 pt-12 sm:pb-24 sm:pt-16 md:pb-28">
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col justify-center text-center lg:text-left"
                    >
                        <h2
                            className={`${scriptFont.className} py-2 text-[clamp(2.3rem,4.6vw,4rem)] leading-[1.15] text-[#E5391C] lg:whitespace-nowrap`}
                        >
                            Catch the Flavor.
                            <br />
                            Own the Craving.
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed tracking-wide text-neutral-300 lg:mx-0">
                            Smoked low and slow, served hot. Pick what you want and we&rsquo;ll get it on the pit.
                        </p>
                    </motion.div>

                    <motion.ul
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mx-auto grid w-full max-w-lg gap-6 sm:gap-8 text-center sm:grid-cols-2 sm:text-left lg:mr-0"
                    >
                        {SERVICE_OPTIONS.map((o) => (
                            <li key={o.label}>
                                <p className={`${displayFont.className} text-xl sm:text-2xl uppercase tracking-[0.06em]`}>
                                    {o.label}
                                </p>
                                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed tracking-wide text-neutral-400">
                                    {o.text}
                                </p>
                            </li>
                        ))}
                    </motion.ul>
                </div>

                <div className="mt-10 sm:mt-14 space-y-5">
                    {categories.map((cat, cIdx) => {
                        const isOpen = open.has(cat.id);
                        const panelId = `${baseId}-${cat.id}-panel`;
                        const buttonId = `${baseId}-${cat.id}-btn`;

                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: cIdx * 0.1 }}
                                className="border-2 border-[#EEEBDC]"
                            >
                                <h3>
                                    <button
                                        id={buttonId}
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(cat.id)}
                                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#EEEBDC] sm:px-8 sm:py-7"
                                    >
                                        <span
                                            className={`${displayFont.className} text-[clamp(1.4rem,3.6vw,2.6rem)] uppercase leading-tight tracking-[0.05em]`}
                                        >
                                            {cat.title}
                                        </span>

                                        <span aria-hidden="true" className="relative block h-5 w-5 sm:h-6 sm:w-6 shrink-0">
                                            <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-[#EEEBDC]" />
                                            <span
                                                className={`absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[#EEEBDC] transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "scale-y-0" : "scale-y-100"
                                                    }`}
                                            />
                                        </span>
                                    </button>
                                </h3>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <ul className="grid gap-x-12 px-4 pb-6 pt-1 sm:px-8 sm:pb-8 sm:pt-2 lg:grid-cols-2">
                                                {cat.items.map((item, itemIdx) => {
                                                    const qty = getItemQty(item.name);
                                                    return (
                                                        <motion.li
                                                            key={item.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: itemIdx * 0.04 }}
                                                            className="flex items-start justify-between gap-3 sm:gap-4 border-b border-white/10 py-4 sm:py-5"
                                                        >
                                                            <div className="min-w-0 pr-2">
                                                                <p className="text-[0.9rem] sm:text-[0.95rem] font-bold uppercase leading-snug tracking-[0.08em] sm:tracking-[0.1em]">
                                                                    {item.name}
                                                                </p>
                                                                {item.description && (
                                                                    <p className="mt-1 text-xs sm:text-sm leading-relaxed tracking-wide text-neutral-400">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                                <span className="text-base sm:text-lg font-medium tabular-nums tracking-wide">
                                                                    {money(item.price)}
                                                                </span>

                                                                {qty === 0 ? (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.93 }}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            addToCart({
                                                                                name: item.name,
                                                                                price: typeof item.price === "number" ? `$${item.price}` : item.price,
                                                                            })
                                                                        }
                                                                        aria-label={`Add ${item.name} to cart`}
                                                                        className={`${ORANGE} py-1 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] sm:tracking-[0.1em] underline-offset-4 hover:underline ${focusRing}`}
                                                                    >
                                                                        Add to cart
                                                                    </motion.button>
                                                                ) : (
                                                                    <div
                                                                        role="group"
                                                                        aria-label={`${item.name} quantity`}
                                                                        className={`${ORANGE} flex items-center bg-white/5 rounded-md px-1`}
                                                                    >
                                                                        <motion.button
                                                                            whileTap={{ scale: 0.85 }}
                                                                            type="button"
                                                                            onClick={() => updateGlobalQty(item.name, -1)}
                                                                            aria-label={`Remove one ${item.name}`}
                                                                            className={`px-2 py-1 text-lg sm:text-xl leading-none ${focusRing}`}
                                                                        >
                                                                            &minus;
                                                                        </motion.button>
                                                                        <span
                                                                            aria-live="polite"
                                                                            className="min-w-5 sm:min-w-6 text-center text-xs sm:text-sm font-bold tabular-nums text-[#EEEBDC]"
                                                                        >
                                                                            {qty}
                                                                        </span>
                                                                        <motion.button
                                                                            whileTap={{ scale: 0.85 }}
                                                                            type="button"
                                                                            onClick={() => updateGlobalQty(item.name, 1)}
                                                                            aria-label={`Add another ${item.name}`}
                                                                            className={`px-2 py-1 text-lg sm:text-xl leading-none ${focusRing}`}
                                                                        >
                                                                            +
                                                                        </motion.button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.li>
                                                    );
                                                })}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}