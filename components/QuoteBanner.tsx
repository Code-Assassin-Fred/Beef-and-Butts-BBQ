import { Anton } from "next/font/google";

// Condensed, heavy stamp-style display face (self-hosted by next/font)
const anton = Anton({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

export default function QuoteBanner() {
    return (
        <section
            aria-label="Beef N Butts BBQ statement"
            className="bg-[#EEEBDC]"
        >
            {/* Hidden SVG filter: roughens glyph edges for the inked / stamped look */}
            <svg
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
                className="absolute"
            >
                <filter id="stamp-rough" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.045"
                        numOctaves="3"
                        seed="7"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="3.2"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            <div className="mx-auto max-w-6xl px-6 py-14 text-center sm:py-20 md:py-24">
                <blockquote>
                    <p
                        className={`${anton.className} text-balance uppercase leading-[1.08] tracking-[0.04em] text-black text-[clamp(1.9rem,5.6vw,4.4rem)]`}
                        style={{ filter: "url(#stamp-rough)" }}
                    >
                        &ldquo;Fire, smoke, and zero apologies.
                        <br className="hidden sm:block" /> Welcome to the pit.&rdquo;
                    </p>
                </blockquote>
            </div>
        </section>
    );
}