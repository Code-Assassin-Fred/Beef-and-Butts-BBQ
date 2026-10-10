"use client";

import Link from "next/link";
import { Jost, Kaushan_Script, League_Gothic } from "next/font/google";
import { motion } from "framer-motion";

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

export default function Footer() {
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
        <footer className={`${jost.className} relative bg-[#0d0d0d] text-white pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-white/10 overflow-hidden`}>
            {/* Top Ember Accent Line */}
            <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-1"
                style={{
                    background: "linear-gradient(90deg, #D42F16 0%, #e8742a 50%, #D42F16 100%)",
                }}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Footer Main Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/20"
                >
                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link href="/" aria-label="Beef and Butts BBQ home" className="inline-flex flex-col leading-none" style={{ color: BRAND_RED }}>
                            <span className={`${script.className} -rotate-[3deg] text-[30px] sm:text-[40px]`} style={{ textShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
                                Beef &amp; Butts
                            </span>
                            <span className={`${jost.className} -mt-1 ml-4 text-[14px] sm:text-[16px] font-extrabold tracking-[0.06em] text-white`}>
                                BAR-B-Q
                            </span>
                        </Link>
                        <p className="mt-4 sm:mt-5 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-sm">
                            Real barbecue takes time, and it&rsquo;s worth every minute. Slow-smoked brisket, rack ribs, glazed chicken, and crispy bhajia made fresh daily.
                        </p>
                        <div className="mt-5 sm:mt-6 space-y-2 text-sm sm:text-base text-white font-medium">
                            <p>Ontario, Canada</p>
                            <p>
                                <a href="tel:+16478898033" className="hover:text-[#D42F16] transition-colors">
                                    +1 (647) 889-8033
                                </a>
                            </p>
                            <p>
                                <a href="mailto:hello@beefnbuttsbbq.com" className="hover:text-[#D42F16] transition-colors">
                                    hello@beefnbuttsbbq.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className={`${headingFont.className} text-xl sm:text-2xl uppercase tracking-wider text-white mb-3 sm:mb-4`}>
                            Navigation
                        </h4>
                        <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-neutral-300 font-medium">
                            <li><a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Home</a></li>
                            <li><a href="#menu" onClick={(e) => handleNavClick(e, "#menu")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Menus</a></li>
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Catering</a></li>
                            <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-[#e8742a] transition-colors cursor-pointer">About</a></li>
                            <li><a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Catering */}
                    <div>
                        <h4 className={`${headingFont.className} text-xl sm:text-2xl uppercase tracking-wider text-white mb-3 sm:mb-4`}>
                            Catering
                        </h4>
                        <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-neutral-300 font-medium">
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Corporate &amp; Workplace</a></li>
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Weddings &amp; Milestones</a></li>
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Family &amp; Social</a></li>
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Community &amp; Fundraisers</a></li>
                            <li><a href="#catering" onClick={(e) => handleNavClick(e, "#catering")} className="hover:text-[#e8742a] transition-colors cursor-pointer">Request a Quote</a></li>
                        </ul>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-neutral-400 font-medium text-center sm:text-left">
                    <p>&copy; 2026 Beef &amp; Butts BBQ. All rights reserved.</p>
                    <div className="flex gap-4 sm:gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
