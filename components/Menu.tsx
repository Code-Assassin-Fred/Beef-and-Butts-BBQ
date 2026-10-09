"use client";

import { useId, useMemo, useState } from "react";
import { Anton, Montserrat, Great_Vibes } from "next/font/google";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });

/* ----------------------------- Menu data ----------------------------- */

type MenuItem = {
    id: string;
    name: string;
    price: number; // CAD
    description?: string;
};

type Category = {
    id: string;
    title: string;
    items: MenuItem[];
};

const CATEGORIES: Category[] = [
    {
        id: "meats",
        title: "Smoked Meats & Platters",
        items: [
            { id: "brisket", name: "BBQ Beef Brisket", price: 18 },
            { id: "chicken-leg", name: "BBQ Chicken Leg", price: 13 },
            { id: "half-rack", name: "1/2 Rack Pork Ribs", price: 20 },
            { id: "full-rack", name: "Full Rack Pork Ribs", price: 35 },
            { id: "pulled-pork", name: "Pulled Pork Sandwich", price: 16 },
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
            { id: "coleslaw", name: "Coleslaw", price: 6 },
            {
                id: "pit-beans",
                name: "Baked Pit Beans",
                price: 5,
                description: "Slow-cooked with brisket burnt ends.",
            },
            { id: "mac", name: "Creamy Mac & Cheese", price: 6 },
            { id: "cornbread", name: "Cornbread with Honey Butter", price: 5 },
            { id: "fries", name: "French Fries", price: 5 },
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

// Display only: shown beside the heading, not selectable
const SERVICE_OPTIONS = [
    { label: "Pickup", text: "Swing by and grab it hot off the pit." },
    { label: "Delivery", text: "We'll bring the smoke to your door." },
];

export type CartLine = { item: MenuItem; quantity: number };

/* ------------------------------ Helpers ------------------------------ */

const money = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);
const total = (n: number) => `$${n.toFixed(2)}`;

// Fine film grain, tiled. Inline SVG, so no image asset is needed.
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const ORANGE = "text-[#FF8A3D]";
const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EEEBDC]";

/* ------------------------------ Component ----------------------------- */

type MenuProps = {
    /** Called whenever the cart changes. */
    onCartChange?: (lines: CartLine[]) => void;
    /** Called when Checkout is pressed in the summary bar. */
    onCheckout?: (lines: CartLine[]) => void;
};

export default function Menu({ onCartChange, onCheckout }: MenuProps) {
    const baseId = useId();
    const [open, setOpen] = useState<Set<string>>(new Set([CATEGORIES[0].id])); // first category open
    const [cart, setCart] = useState<Record<string, number>>({});

    const allItems = useMemo(() => CATEGORIES.flatMap((c) => c.items), []);
    const toLines = (c: Record<string, number>): CartLine[] =>
        allItems.filter((i) => c[i.id] > 0).map((item) => ({ item, quantity: c[item.id] }));

    const lines = useMemo(() => toLines(cart), [cart]); // eslint-disable-line react-hooks/exhaustive-deps
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.item.price, 0);

    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const setQty = (id: string, delta: number) =>
        setCart((prev) => {
            const qty = Math.max(0, (prev[id] ?? 0) + delta);
            const next = { ...prev, [id]: qty };
            if (qty === 0) delete next[id];
            onCartChange?.(toLines(next));
            return next;
        });

    return (
        <section
            id="menu"
            aria-label="Menu"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#131313] to-[#1c1c1c] text-[#EEEBDC]`}
        >
            {/* Shared SVG filters (ids prefixed so they never clash with other sections) */}
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

            {/* Film grain */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
                style={{ backgroundImage: GRAIN }}
            />

            {/* Top edge: charred band with ragged lower edge + soot flecks */}
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

            {/* Bottom edge: rough red ember streak */}
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

            <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-16 md:pb-28">
                {/* Header: tagline + text on the left, pickup / delivery on the right */}
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
                    <div className="flex flex-col justify-center text-center lg:text-left">
                        <h2
                            className={`${scriptFont.className} py-2 text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.1] text-[#E5391C] lg:whitespace-nowrap`}
                        >
                            Catch the Flavor.
                            <br />
                            Own the Craving.
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed tracking-wide text-neutral-300 lg:mx-0">
                            Smoked low and slow, served hot. Pick what you want and we&rsquo;ll get it on the pit.
                        </p>
                    </div>

                    <ul className="mx-auto grid w-full max-w-lg gap-8 text-center sm:grid-cols-2 sm:text-left lg:mr-0">
                        {SERVICE_OPTIONS.map((o) => (
                            <li key={o.label}>
                                <p className={`${displayFont.className} text-2xl uppercase tracking-[0.06em]`}>
                                    {o.label}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed tracking-wide text-neutral-400">
                                    {o.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div className="mt-14 space-y-5">
                    {CATEGORIES.map((cat) => {
                        const isOpen = open.has(cat.id);
                        const panelId = `${baseId}-${cat.id}-panel`;
                        const buttonId = `${baseId}-${cat.id}-btn`;

                        return (
                            <div key={cat.id} className="border-2 border-[#EEEBDC]">
                                <h3>
                                    <button
                                        id={buttonId}
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(cat.id)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#EEEBDC] sm:px-8 sm:py-7"
                                    >
                                        <span
                                            className={`${displayFont.className} text-[clamp(1.6rem,3.6vw,2.6rem)] uppercase leading-tight tracking-[0.05em]`}
                                        >
                                            {cat.title}
                                        </span>

                                        {/* Minus when open, plus when closed */}
                                        <span aria-hidden="true" className="relative block h-6 w-6 shrink-0">
                                            <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-[#EEEBDC]" />
                                            <span
                                                className={`absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[#EEEBDC] transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "scale-y-0" : "scale-y-100"
                                                    }`}
                                            />
                                        </span>
                                    </button>
                                </h3>

                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    className={`grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none ${isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <ul className="grid gap-x-12 px-5 pb-8 pt-2 sm:px-8 lg:grid-cols-2">
                                            {cat.items.map((item) => {
                                                const qty = cart[item.id] ?? 0;
                                                return (
                                                    <li
                                                        key={item.id}
                                                        className="flex items-start justify-between gap-4 border-b border-white/10 py-5"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-[0.95rem] font-bold uppercase leading-snug tracking-[0.1em] sm:text-base">
                                                                {item.name}
                                                            </p>
                                                            {item.description && (
                                                                <p className="mt-1.5 text-sm leading-relaxed tracking-wide text-neutral-400">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                                            <span className="text-lg font-medium tabular-nums tracking-wide">
                                                                {money(item.price)}
                                                            </span>

                                                            {qty === 0 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setQty(item.id, 1)}
                                                                    aria-label={`Add ${item.name} to cart`}
                                                                    className={`${ORANGE} py-1 text-sm font-semibold uppercase tracking-[0.1em] underline-offset-4 hover:underline ${focusRing}`}
                                                                >
                                                                    Add to cart
                                                                </button>
                                                            ) : (
                                                                <div
                                                                    role="group"
                                                                    aria-label={`${item.name} quantity`}
                                                                    className={`${ORANGE} flex items-center`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setQty(item.id, -1)}
                                                                        aria-label={`Remove one ${item.name}`}
                                                                        className={`px-2 py-1 text-xl leading-none ${focusRing}`}
                                                                    >
                                                                        &minus;
                                                                    </button>
                                                                    <span
                                                                        aria-live="polite"
                                                                        className="min-w-6 text-center text-sm font-bold tabular-nums text-[#EEEBDC]"
                                                                    >
                                                                        {qty}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setQty(item.id, 1)}
                                                                        aria-label={`Add another ${item.name}`}
                                                                        className={`px-2 py-1 text-xl leading-none ${focusRing}`}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cart summary, appears once something is added */}
                <div role="status" aria-live="polite" className="mt-8">
                    {count > 0 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-2 border-[#EEEBDC] px-5 py-4 sm:flex-row sm:px-8">
                            <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] sm:text-left sm:text-base">
                                {count} {count === 1 ? "item" : "items"}
                                <span className="mx-3 text-neutral-500" aria-hidden="true">|</span>
                                Subtotal {total(subtotal)}
                            </p>
                            <button
                                type="button"
                                onClick={() => onCheckout?.(lines)}
                                className={`${ORANGE} border-b-[3px] border-[#FF8A3D] pb-1 text-sm font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-80 ${focusRing}`}
                            >
                                Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}