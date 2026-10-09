import Image from "next/image";
import Link from "next/link";
import {
    Anton,
    Jost,
    League_Gothic,
    Montserrat,
    Great_Vibes,
    Playfair_Display,
} from "next/font/google";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const headingFont = League_Gothic({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const darkBodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });
const ampFont = Playfair_Display({ subsets: ["latin"], style: "italic", weight: "700", display: "swap" });

/* ------------------------------- Data -------------------------------- */

type Category = {
    id: string;
    title: string;
    description: string;
    groups: string[];
    /** Drop a photo in /public and set it here. Until then a placeholder shows. */
    image?: { src: string; alt: string };
};

const CATEGORIES: Category[] = [
    {
        id: "corporate",
        title: "Corporate & Workplace",
        description:
            "Business lunches, meetings, conferences and corporate functions. Smoked fresh and easy to serve, whatever the size of your team.",
        groups: [
            "Office lunches",
            "Team celebrations",
            "Client meetings",
            "Conferences & trade shows",
            "Grand openings",
        ],
        // image: { src: "/images/catering/corporate.jpg", alt: "Smoked BBQ trays set up for an office lunch" },
    },
    {
        id: "weddings",
        title: "Weddings & Milestones",
        description:
            "Wedding receptions, anniversaries and engagement parties. Slow-smoked BBQ that gives your big day a menu people talk about.",
        groups: [
            "Weddings",
            "Engagement parties",
            "Rehearsal dinners",
            "Showers (bridal and baby)",
            "Anniversaries",
            "Graduations",
        ],
    },
    {
        id: "family",
        title: "Family & Social",
        description:
            "Birthdays, family gatherings and intimate celebrations, from backyard cookouts to game day. Food that keeps everyone at the table.",
        groups: [
            "Birthdays",
            "Backyard cookouts",
            "Family reunions",
            "Holiday gatherings",
            "Game day & watch parties",
        ],
    },
    {
        id: "community",
        title: "Community & Fundraisers",
        description:
            "School and church events, charity fundraisers, festivals and markets. Outdoor-ready BBQ that feeds a crowd and keeps the line moving.",
        groups: ["School & church events", "Charity fundraisers", "Festivals & markets"],
    },
];

const STEPS = [
    {
        n: "01",
        title: "Inquire",
        text: "Send us your event date, guest count, and vision. No strings attached.",
    },
    {
        n: "02",
        title: "Custom Menu & Quote",
        text: "We build a menu around your event and send over a clear, itemized quote.",
    },
    {
        n: "03",
        title: "Confirm & Serve",
        text: "Lock in your date and leave the cooking, setup, and service to us.",
    },
];

/* ------------------------------ Texture ------------------------------ */

// Same rough paper texture as the Service Columns section (inline SVG noise, no image files).
const svg = (inner: string, size: number) =>
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${inner}</svg>")`;

const GRAIN = svg(
    "<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/>",
    200
);
const MOTTLE = svg(
    "<filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='3' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -0.2'/></filter><rect width='100%' height='100%' filter='url(%23m)'/>",
    600
);
const FLECKS = svg(
    "<filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -8.6'/></filter><rect width='100%' height='100%' filter='url(%23f)'/>",
    300
);

// Fine film grain for the dark band (light specks on black)
const DARK_GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ----------------------------- Components ---------------------------- */

const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D42F16]";

function Arrow({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 10 14" aria-hidden="true" className={className}>
            <path d="M1.2 1.2 8.6 7 1.2 12.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
    );
}

type Props = {
    /** Where the quote buttons go. Category cards add ?event=<id>. */
    quoteHref?: string;
};

export default function CateringEvents({ quoteHref = "/quote" }: Props) {
    return (
        <section
            id="catering"
            aria-label="Catering and events"
            className={`${bodyFont.className} relative overflow-hidden bg-white text-neutral-900`}
        >
            {/* All SVG filters for the whole section (ids prefixed) */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                {/* Torn photo edges */}
                <filter id="cat-torn" x="-6%" y="-8%" width="112%" height="116%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="6" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                {/* Distressed headline type */}
                <filter id="cat-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
                {/* Dark band: charred top edge, soot flecks, ember streak */}
                <filter id="cat-torn-edge" x="-5%" y="-50%" width="110%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.22" numOctaves="4" seed="4" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="cat-flecks" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="11" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -6.3" result="speck" />
                    <feComposite in="SourceGraphic" in2="speck" operator="in" />
                </filter>
                <filter id="cat-streak" x="-5%" y="-300%" width="110%" height="700%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.5" numOctaves="3" seed="2" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* ============ Part 1: event categories (white, rough texture) ============ */}
            <div className="relative isolate">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply"
                    style={{
                        backgroundImage: `${FLECKS}, ${MOTTLE}, ${GRAIN}`,
                        backgroundSize: "300px 300px, 600px 600px, 200px 200px",
                    }}
                />

                <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
                    <h2
                        className={`${headingFont.className} text-center text-[clamp(3rem,5.2vw,4.5rem)] uppercase leading-none tracking-[0.01em] text-[#D42F16]`}
                    >
                        Catering{" "}
                        <span className={`${ampFont.className} text-[0.8em] font-bold normal-case`}>&amp;</span>{" "}
                        Events
                    </h2>

                    <div className="mt-14 md:mt-20">
                        {CATEGORIES.map((cat, i) => {
                            const flip = i % 2 === 1;
                            return (
                                <article
                                    key={cat.id}
                                    className="relative mb-16 grid items-center last:mb-0 lg:mb-28 lg:grid-cols-12 lg:last:mb-0"
                                >
                                    {/* Photo with torn, grimy edges */}
                                    <div
                                        className={`relative aspect-[4/3] sm:aspect-[16/10] lg:col-span-8 lg:row-start-1 ${flip ? "lg:col-start-5" : "lg:col-start-1"
                                            }`}
                                    >
                                        <div className="absolute inset-0" style={{ filter: "url(#cat-torn)" }}>
                                            {cat.image ? (
                                                <Image
                                                    src={cat.image.src}
                                                    alt={cat.image.alt}
                                                    fill
                                                    sizes="(min-width: 1024px) 66vw, 100vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div
                                                    role="img"
                                                    aria-label={`${cat.title} photo placeholder`}
                                                    className="flex h-full w-full items-end bg-gradient-to-br from-[#3d2b23] via-[#2a1d18] to-[#15100d] p-6"
                                                >
                                                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                                        Photo: {cat.title}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Dark red grime creeping in from the edges */}
                                            <div
                                                aria-hidden="true"
                                                className="absolute inset-0 shadow-[inset_0_0_45px_12px_rgba(70,8,6,0.65)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Description card */}
                                    <div
                                        className={`relative z-10 -mt-12 mx-4 bg-[#0f0f0f] p-7 text-white sm:mx-8 sm:p-10 lg:mx-0 lg:mt-0 lg:col-span-6 lg:row-start-1 lg:p-12 ${flip ? "lg:col-start-1 lg:-translate-y-8" : "lg:col-start-7 lg:translate-y-10"
                                            }`}
                                    >
                                        <h3
                                            className={`${displayFont.className} text-[clamp(2rem,3.6vw,3.25rem)] uppercase leading-[1.05] tracking-[0.02em]`}
                                            style={{ filter: "url(#cat-stamp)" }}
                                        >
                                            {cat.title}
                                        </h3>

                                        <p className="mt-5 text-lg leading-relaxed text-neutral-200">{cat.description}</p>

                                        <ul className="mt-6 grid gap-x-8 gap-y-2 text-[0.95rem] text-neutral-400 sm:grid-cols-2">
                                            {cat.groups.map((g) => (
                                                <li key={g} className="flex items-start gap-3">
                                                    <span aria-hidden="true" className="mt-[0.6rem] h-[3px] w-3 shrink-0 bg-[#D42F16]" />
                                                    {g}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href={{ pathname: quoteHref, query: { event: cat.id } }}
                                            className={`${displayFont.className} mt-9 inline-flex items-center gap-3 bg-[#D42F16] px-7 py-4 text-xl uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#B72511] ${focusRing}`}
                                        >
                                            Get a Quote
                                            <Arrow className="h-4 w-3" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ============ Part 2: "Let's talk food" (dark band at the bottom of the same section) ============ */}
            <div
                className={`${darkBodyFont.className} relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#131313] to-[#1c1c1c] text-[#EEEBDC]`}
            >
                {/* Film grain */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
                    style={{ backgroundImage: DARK_GRAIN }}
                />

                {/* Top edge: charred band + soot flecks */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28">
                    <div className="absolute inset-x-0 -top-4 h-12 bg-[#050505]" style={{ filter: "url(#cat-torn-edge)" }} />
                    <div
                        className="absolute inset-x-0 top-6 h-14 bg-[#050505]"
                        style={{
                            filter: "url(#cat-flecks)",
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
                            filter: "url(#cat-streak)",
                        }}
                    />
                </div>

                <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-24 md:pb-28">
                    <div className="text-center">
                        <h3
                            className={`${scriptFont.className} py-2 text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] text-[#E5391C]`}
                        >
                            Planning something?
                            <br />
                            Let&rsquo;s talk food.
                        </h3>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed tracking-wide text-neutral-300">
                            Tell us about your event and we&rsquo;ll put together a custom menu and quote.
                        </p>
                    </div>

                    {/* Steps: a real sequence, so numbering is meaningful */}
                    <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
                        {STEPS.map((s, i) => (
                            <li
                                key={s.n}
                                className={`md:px-8 lg:px-10 ${i > 0 ? "md:border-l md:border-white/15" : "md:pl-0"} ${i === STEPS.length - 1 ? "md:pr-0" : ""
                                    }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${displayFont.className} block text-6xl leading-none tracking-[0.04em] text-[#E5391C]`}
                                >
                                    {s.n}
                                </span>
                                <h4
                                    className={`${displayFont.className} mt-5 text-3xl uppercase leading-tight tracking-[0.05em]`}
                                >
                                    {s.title}
                                </h4>
                                <p className="mt-3 max-w-xs text-base leading-relaxed text-neutral-400">{s.text}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-16 text-center">
                        <Link
                            href={quoteHref}
                            className={`${displayFont.className} inline-flex items-center gap-4 bg-[#D42F16] px-12 py-5 text-3xl uppercase tracking-[0.06em] text-white shadow-[0_6px_0_#8f1c0b] transition hover:translate-y-[2px] hover:bg-[#B72511] hover:shadow-[0_4px_0_#8f1c0b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EEEBDC]`}
                        >
                            Request a Quote
                            <Arrow className="h-6 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}