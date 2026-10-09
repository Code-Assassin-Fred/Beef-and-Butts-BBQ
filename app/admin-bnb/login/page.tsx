"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Anton, Great_Vibes, Montserrat } from "next/font/google";
import { motion } from "framer-motion";

const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400" });
const displayFont = Anton({ subsets: ["latin"], weight: "400" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AdminLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGoogleSignIn() {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                router.push("/admin-bnb/dashboard");
            }
        } catch (err: any) {
            console.error("Google Auth error:", err);
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`${bodyFont.className} min-h-screen w-screen bg-[#0b0f19] text-white flex flex-col md:flex-row overflow-hidden`}>
            {/* Left 40% Width: Login Form */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-[40%] flex flex-col justify-between p-5 sm:p-10 lg:p-14 min-h-screen z-10 bg-[#0b0f19]"
            >
                {/* Header Branding */}
                <div className="flex items-center gap-3">
                    <div className="flex items-baseline leading-none">
                        <span className={`${scriptFont.className} text-[#FF8A3D] text-3xl sm:text-4xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]`}>
                            Beef N' Butts
                        </span>
                        <span className={`${displayFont.className} text-white text-base sm:text-lg tracking-[0.2em] uppercase ml-2.5`}>
                            ADMIN
                        </span>
                    </div>
                </div>

                {/* Login Button Section */}
                <div className="my-auto py-6 sm:py-8 max-w-sm w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6 sm:mb-8"
                    >
                        <h1 className={`${displayFont.className} text-3xl sm:text-5xl tracking-wide uppercase text-white`}>
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                            Sign in with your admin Google account to manage menu items, categories, photo gallery, orders, and catering quotes.
                        </p>
                    </motion.div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs sm:text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3.5 sm:py-4 px-4 sm:px-5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg cursor-pointer disabled:opacity-60"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
                    </motion.button>
                </div>

                {/* Back to main site */}
                <div className="pt-4">
                    <a
                        href="/"
                        className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2"
                    >
                        <span>← Back to Beef N' Butts BBQ</span>
                    </a>
                </div>
            </motion.div>

            {/* Right 60% Width: Featured Hero Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block md:w-[60%] relative h-full min-h-screen overflow-hidden"
            >
                <Image
                    src="/Assets/glazed-bbq-chicken.jpg"
                    alt="Beef N' Butts BBQ Glazed Chicken"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-transparent to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-80" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="absolute bottom-12 left-12 right-12 text-white max-w-lg"
                >
                    <span className="bg-[#FF8A3D] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                        Beef N' Butts BBQ
                    </span>
                    <h2 className={`${displayFont.className} text-4xl lg:text-5xl tracking-wide uppercase mt-3 drop-shadow-md`}>
                        Authentic Slow-Smoked Barbecue
                    </h2>
                </motion.div>
            </motion.div>
        </div>
    );
}
