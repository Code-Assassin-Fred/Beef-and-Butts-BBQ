import Image from "next/image";
import Link from "next/link";
import { Anton, Jost } from "next/font/google";

const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const bodyFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

type Props = {
    image?: { src: string; alt: string };
    orderHref?: string;
};

export default function OrderBanner({
    image = {
        src: "/Assets/glazed-bbq-chicken.jpg",
        alt: "Glazed BBQ chicken with a dark, sticky char",
    },
    orderHref = "/order",
}: Props) {
    return (
        <section
            aria-labelledby="order-banner-heading"
            className={`${bodyFont.className} relative isolate overflow-hidden bg-[#0a0a0a] text-white`}
        >
            {/* Shared SVG filter: distressed headline type */}
            <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id="banner-stamp" x="-3%" y="-3%" width="106%" height="106%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="grit" />
                    <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 9.2" result="holes" />
                    <feComposite in="d" in2="holes" operator="in" />
                </filter>
            </svg>

            {/* Background photo */}
            <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="-z-10 object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/25" />

            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-28">
                {/* Translucent rust box */}
                <div className="bg-[#C73A17]/90 px-6 py-14 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:px-12 md:px-20 md:py-20">
                    <h2
                        id="order-banner-heading"
                        className={`${displayFont.className} text-[clamp(2.2rem,5.2vw,4.5rem)] uppercase leading-[1.05] tracking-[0.03em]`}
                        style={{ filter: "url(#banner-stamp)" }}
                    >
                        Hot off the smoker.{" "}
                        <span className="inline-block -skew-x-12 text-[#FFD9B8]">At your door.</span>
                    </h2>

                    <p className="mx-auto mt-7 max-w-3xl text-[clamp(1.1rem,1.7vw,1.5rem)] leading-[1.6] text-white/95">
                        Brisket with a proper bark, ribs that slide off the bone, bhajia fried to a crackle. Order for
                        pickup or delivery and we&apos;ll bring the smokehouse to your table.
                    </p>

                    <Link
                        href={orderHref}
                        className={`${displayFont.className} mt-10 inline-block bg-[#1c1c1c] px-9 py-4 text-xl uppercase tracking-[0.06em] text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                    >
                        Order now
                    </Link>
                </div>
            </div>
        </section>
    );
}