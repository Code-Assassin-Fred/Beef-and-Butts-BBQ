"use client";

import Link from "next/link";
import { Jost, Kaushan_Script, League_Gothic } from "next/font/google";

const jost = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const script = Kaushan_Script({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const headingFont = League_Gothic({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const BRAND_RED = "#D42F16";
const ACCENT_ORANGE = "#e8742a";

export default function Footer() {
    return (
        <footer className={`${jost.className} relative bg-[#0d0d0d] text-white pt-16 pb-12 border-t border-white/10 overflow-hidden`}>
            {/* Top Ember Accent Line */}
            <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-1"
                style={{
                    background: "linear-gradient(90deg, #D42F16 0%, #e8742a 50%, #D42F16 100%)",
                }}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Footer Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/20">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" aria-label="Beef and Butts BBQ home" className="inline-flex flex-col leading-none" style={{ color: BRAND_RED }}>
                            <span className={`${script.className} -rotate-[3deg] text-[34px] sm:text-[40px]`} style={{ textShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
                                Beef &amp; Butts
                            </span>
                            <span className={`${jost.className} -mt-1 ml-4 text-[16px] font-extrabold tracking-[0.06em] text-white`}>
                                BAR-B-Q
                            </span>
                        </Link>
                        <p className="mt-5 text-neutral-200 text-base leading-relaxed max-w-sm">
                            Real barbecue takes time, and it&rsquo;s worth every minute. Slow-smoked brisket, rack ribs, glazed chicken, and crispy bhajia made fresh daily.
                        </p>
                        <div className="mt-6 space-y-2.5 text-base text-white font-medium">
                            <p className="flex items-center gap-2">
                                <span className="text-[#D42F16]">📍</span> Ontario, Canada
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-[#D42F16]">📞</span>{" "}
                                <a href="tel:+16478898033" className="hover:text-[#D42F16] transition-colors">
                                    +1 (647) 889-8033
                                </a>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-[#D42F16]">✉️</span>{" "}
                                <a href="mailto:hello@beefnbuttsbbq.com" className="hover:text-[#D42F16] transition-colors">
                                    hello@beefnbuttsbbq.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className={`${headingFont.className} text-2xl uppercase tracking-wider text-white mb-4`}>
                            Navigation
                        </h4>
                        <ul className="space-y-3 text-base text-neutral-200 font-medium">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/catering" className="hover:text-white transition-colors">Catering</Link></li>
                            <li><Link href="/menu" className="hover:text-white transition-colors">Locations &amp; Menus</Link></li>
                            <li><Link href="/rewards" className="hover:text-white transition-colors">Rewards</Link></li>
                            <li><Link href="/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Catering */}
                    <div>
                        <h4 className={`${headingFont.className} text-2xl uppercase tracking-wider text-white mb-4`}>
                            Catering
                        </h4>
                        <ul className="space-y-3 text-base text-neutral-200 font-medium">
                            <li><Link href="/catering?event=corporate" className="hover:text-white transition-colors">Corporate &amp; Workplace</Link></li>
                            <li><Link href="/catering?event=weddings" className="hover:text-white transition-colors">Weddings &amp; Milestones</Link></li>
                            <li><Link href="/catering?event=family" className="hover:text-white transition-colors">Family &amp; Social</Link></li>
                            <li><Link href="/catering?event=community" className="hover:text-white transition-colors">Community &amp; Fundraisers</Link></li>
                            <li><Link href="/catering" className="hover:text-white transition-colors">Request a Quote</Link></li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className={`${headingFont.className} text-2xl uppercase tracking-wider text-white mb-4`}>
                            Smoker Hours
                        </h4>
                        <ul className="space-y-3 text-base text-neutral-200 font-medium">
                            <li className="flex justify-between gap-2">
                                <span>Mon &ndash; Thu:</span>
                                <span className="text-white font-bold">11am &ndash; 9pm</span>
                            </li>
                            <li className="flex justify-between gap-2">
                                <span>Fri &ndash; Sat:</span>
                                <span className="text-white font-bold">11am &ndash; 10pm</span>
                            </li>
                            <li className="flex justify-between gap-2">
                                <span>Sunday:</span>
                                <span className="text-white font-bold">12pm &ndash; 8pm</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-300 font-medium">
                    <p>&copy; 2026 Beef &amp; Butts BBQ. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
