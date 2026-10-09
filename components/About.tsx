import Image from "next/image";
import { Anton, Jost } from "next/font/google";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

/* ------------------------------ Content ------------------------------ */

// TODO: confirm every line below with the client before launch (founder story, location, dates).
const PARAGRAPHS = [
    "Beef N Butts BBQ was built on a simple idea: real barbecue takes time, and it is worth every minute. We cook over fire and slow smoke until the brisket gives up, the ribs wear a deep, sticky bark, and the chicken comes off the grill glazed and a little bit charred.",
    "We also like to play with our food. Crispy bhajia with chilli sauce, curry chip dip, and smoked ribs share the same table here, classic pit flavor with a twist you won't find at the next smokehouse.",
    "Pick it up, have it delivered, or let us bring the pit to your next event. However it reaches you, it leaves our fire hot and loud.",
];

const GALLERY_TITLE = "Pit-Fired. Plate-Ready.";
const GALLERY_TEXT =
    "Bark-crusted ribs, glazed chicken and bhajia with a kick of chilli: a look at what leaves our smoker and fryer every day.";

type GalleryItem = { name: string; src: string; alt: string };

const GALLERY: GalleryItem[] = [
    { name: "Ribs & Bhajia", src: "/Assets/bbq-ribs-with-bhajia.jpg", alt: "BBQ ribs served with crispy bhajia" },
    { name: "Bhajia & Chilli Sauce", src: "/Assets/bhajia-with-chilli-sauce.jpg", alt: "Crispy bhajia with chilli sauce" },
    { name: "Curry & Tortilla Chips", src: "/Assets/curry-with-tortilla-chips.jpg", alt: "Curry dip with tortilla chips" },
    { name: "Glazed BBQ Chicken", src: "/Assets/glazed-bbq-chicken.jpg", alt: "Glazed BBQ chicken fresh off the grill" },
    { name: "Clean Plate", src: "/Assets/munched.jpg", alt: "A plate cleared after a BBQ meal" },
    { name: "Seasoned Rib Racks", src: "/Assets/seasoned-rib-racks-raw.jpg", alt: "Seasoned raw rib racks ready for the smoker" },
    { name: "Sliced Brisket & Greens", src: "/Assets/sliced-brisket-with-greens.jpg", alt: "Sliced smoked brisket served with greens" },
    { name: "Fresh Tortilla Chips", src: "/Assets/tortilla-chips-prep.jpg", alt: "Tortilla chips being prepared" },
];

/* ------------------------------ Texture ------------------------------ */

// Same rough paper texture as the other white sections (inline SVG noise, no image files).
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

/* ----------------------------- Component ----------------------------- */

type Props = {
    /** Background photo for the parallax hero. */
    heroImage?: { src: string; alt: string };
};

export default function About({
    heroImage = {
        src: "/Assets/sliced-brisket-with-greens.jpg",
        alt: "Sliced smoked brisket served with greens",
    },
}: Props) {
    return (
        <>
            {/* Shared SVG filter: distressed headline type */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="about-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
            </svg>

            {/* ===== Parallax hero =====
          The photo is position:fixed, but the section is clipped with clip-path,
          so the image stays still while the text scrolls over it and the next
          section slides up and covers it. Works on iOS too (unlike background-attachment: fixed). */}
            <section
                aria-labelledby="about-heading"
                className={`${bodyFont.className} relative isolate flex min-h-[100svh] items-center bg-[#0a0a0a] text-white`}
                style={{ clipPath: "inset(0)" }}
            >
                <div aria-hidden="false" className="fixed inset-0 -z-10 motion-reduce:absolute">
                    <Image
                        src={heroImage.src}
                        alt={heroImage.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    {/* Darken for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
                </div>

                <div className="mx-auto w-full max-w-7xl px-6 pt-36 pb-28 text-center sm:px-10 sm:pt-48 md:pb-40 lg:pt-56">
                    <h1
                        id="about-heading"
                        className={`${displayFont.className} text-[clamp(1.9rem,4.2vw,4rem)] uppercase leading-[1.05] tracking-[0.02em] md:whitespace-nowrap`}
                        style={{ filter: "url(#about-stamp)" }}
                    >
                        Smoked slow. Served with{" "}
                        <span className="relative inline-block text-[#FF8A3D] after:absolute after:inset-x-0 after:-bottom-2 after:h-[3px] after:bg-[#FF8A3D]">
                            swagger
                        </span>
                        .
                    </h1>

                    <div className="mt-14 space-y-8 text-[clamp(1.1rem,1.8vw,1.6rem)] leading-[1.6] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)] md:mt-16 md:space-y-10">
                        {PARAGRAPHS.map((p) => (
                            <p key={p} className="mx-auto max-w-6xl text-white/95">
                                {p}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Gallery: slides up over the still photo ===== */}
            <section
                aria-labelledby="gallery-heading"
                className={`${bodyFont.className} relative z-10 isolate bg-white`}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply"
                    style={{
                        backgroundImage: `${FLECKS}, ${MOTTLE}, ${GRAIN}`,
                        backgroundSize: "300px 300px, 600px 600px, 200px 200px",
                    }}
                />

                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
                    <header className="mx-auto max-w-2xl text-center">
                        <h2
                            id="gallery-heading"
                            className={`${displayFont.className} text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1.05] tracking-[0.02em] text-[#0f0f0f]`}
                            style={{ filter: "url(#about-stamp)" }}
                        >
                            {GALLERY_TITLE}
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-neutral-700 md:text-xl">{GALLERY_TEXT}</p>
                    </header>

                    <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 md:mt-16">
                        {GALLERY.map((item) => (
                            <li key={item.src}>
                                <figure className="group relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#0f0f0f] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                    {/* Shade so the name reads on any photo */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                        <span
                                            className={`${displayFont.className} block text-[1.6rem] uppercase leading-tight tracking-[0.04em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:text-[1.75rem]`}
                                        >
                                            {item.name}
                                        </span>
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}