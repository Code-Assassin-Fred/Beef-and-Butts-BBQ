"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Anton, Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const displayFont = Anton({ subsets: ["latin"], weight: "400" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type OrderType = "delivery" | "pickup";

// Feature flag: set to true to restore scheduled date & time pickers in checkout
const ENABLE_SCHEDULED_SLOTS = false;

export default function FloatingCart() {
    const {
        cart,
        updateQty,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();

    const [expanded, setExpanded] = useState(false);
    const [view, setView] = useState<"cart" | "checkout" | "success">("cart");
    
    // Checkout Form State
    const [orderType, setOrderType] = useState<OrderType>("delivery");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const hasDragged = useRef(false);

    // Set initial position on mount (upper-right desktop/mobile)
    useEffect(() => {
        if (!position) {
            const initialX = Math.max(12, window.innerWidth - 340);
            setPosition({
                x: initialX,
                y: 100,
            });
        }
    }, [position]);

    const clamp = useCallback(
        (x: number, y: number) => {
            const el = containerRef.current;
            const w = el ? el.offsetWidth : 300;
            const h = el ? el.offsetHeight : 48;
            return {
                x: Math.max(0, Math.min(x, window.innerWidth - w)),
                y: Math.max(0, Math.min(y, window.innerHeight - h)),
            };
        },
        []
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest("input, button, select, textarea, a, [data-no-drag]")) return;
            e.preventDefault();
            setIsDragging(true);
            hasDragged.current = false;
            const rect = containerRef.current!.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        },
        []
    );

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            hasDragged.current = true;
            const newPos = clamp(
                e.clientX - dragOffset.current.x,
                e.clientY - dragOffset.current.y
            );
            setPosition(newPos);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, clamp]);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if ((e.target as HTMLElement).closest("input, button, select, textarea, a, [data-no-drag]")) return;
            setIsDragging(true);
            hasDragged.current = false;
            const touch = e.touches[0];
            const rect = containerRef.current!.getBoundingClientRect();
            dragOffset.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        },
        []
    );

    useEffect(() => {
        if (!isDragging) return;

        const handleTouchMove = (e: TouchEvent) => {
            hasDragged.current = true;
            const touch = e.touches[0];
            const newPos = clamp(
                touch.clientX - dragOffset.current.x,
                touch.clientY - dragOffset.current.y
            );
            setPosition(newPos);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, clamp]);

    const handleHeaderClick = () => {
        if (hasDragged.current) return;
        setExpanded((prev) => !prev);
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName || !customerPhone) {
            alert("Please fill in your name and phone number.");
            return;
        }

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    total: totalPrice,
                    totalPrice: totalPrice,
                    orderType,
                    date: ENABLE_SCHEDULED_SLOTS ? date : "",
                    time: ENABLE_SCHEDULED_SLOTS ? time : "",
                    location,
                    customerName,
                    customerPhone,
                }),
            });

            if (res.ok) {
                setOrderSubmitted(true);
                setView("success");
                clearCart();
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch {
            alert("Network error. Please try again.");
        }
    };

    if (totalItems === 0 && !expanded) return null;

    return (
        <motion.div
            ref={containerRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={
                position
                    ? { left: position.x, top: position.y, position: "fixed", zIndex: 9999 }
                    : { right: 16, top: 100, position: "fixed", zIndex: 9999 }
            }
            className={`${bodyFont.className} select-none`}
        >
            {/* Floating Pill Trigger */}
            <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onClick={handleHeaderClick}
                className="group flex cursor-grab active:cursor-grabbing items-center gap-2.5 sm:gap-3 rounded-full bg-[#0a0a0a]/95 px-4 sm:px-5 py-2.5 sm:py-3 text-white shadow-2xl ring-2 ring-[#e4202b]/60 backdrop-blur-md transition-all hover:ring-[#e4202b]"
            >
                <div className="relative flex items-center justify-center">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#e4202b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {totalItems > 0 && (
                        <motion.span
                            key={totalItems}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e4202b] text-[11px] sm:text-xs font-bold text-white shadow-md"
                        >
                            {totalItems}
                        </motion.span>
                    )}
                </div>

                <div className="flex flex-col text-left">
                    <span className={`${displayFont.className} text-sm sm:text-base tracking-wider uppercase text-white leading-tight`}>
                        {totalItems > 0 ? `${totalItems} Items` : "Cart Empty"}
                    </span>
                    {totalItems > 0 && (
                        <span className="text-[11px] sm:text-xs text-white font-bold">
                            ${totalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                <button
                    data-no-drag
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((p) => !p);
                    }}
                    className="ml-1 sm:ml-2 rounded-full p-1 text-white/80 hover:text-white"
                >
                    <svg className={`h-4 w-4 transform transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </motion.div>

            {/* Cart Modal Dropdown */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        data-no-drag
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 w-80 max-w-[92vw] rounded-sm bg-[#121212]/98 backdrop-blur-md p-4 text-white shadow-2xl ring-1 ring-white/20 border border-white/10"
                    >
                        {view === "cart" && (
                            <div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className={`${displayFont.className} text-base uppercase tracking-wider text-white`}>Your BBQ Order</h3>
                                    <button
                                        onClick={() => setExpanded(false)}
                                        className="text-xs text-neutral-300 hover:text-white font-medium"
                                    >
                                        Close
                                    </button>
                                </div>

                                {cart.length === 0 ? (
                                    <p className="py-6 text-center text-xs text-neutral-200">Your cart is empty.</p>
                                ) : (
                                    <div className="mt-3 max-h-60 overflow-y-auto space-y-3 pr-1">
                                        {cart.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between text-sm">
                                                <div className="flex-1 pr-2">
                                                    <p className="font-semibold text-white text-xs sm:text-sm">{item.name}</p>
                                                    <p className="text-xs text-neutral-200 font-medium">{item.price}</p>
                                                </div>

                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={() => updateQty(item.name, -1)}
                                                        className="h-6 w-6 rounded-sm bg-white/10 text-center font-bold text-white hover:bg-white/20 active:scale-95"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-4 text-center text-xs font-bold text-white">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.name, 1)}
                                                        className="h-6 w-6 rounded-sm bg-white/10 text-center font-bold text-white hover:bg-white/20 active:scale-95"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.name)}
                                                        className="ml-1 text-red-400 hover:text-red-300 text-xs"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {cart.length > 0 && (
                                    <div className="mt-4 border-t border-white/10 pt-3">
                                        <div className="flex justify-between font-bold text-sm mb-3 text-white">
                                            <span>Total:</span>
                                            <span className="text-white">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => setView("checkout")}
                                                className="w-auto rounded-sm bg-[#e4202b] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c81b24] active:scale-[0.98]"
                                            >
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {view === "checkout" && (
                            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <h3 className={`${displayFont.className} text-base uppercase text-white`}>Checkout</h3>
                                    <button type="button" onClick={() => setView("cart")} className="text-neutral-300 hover:text-white font-medium">Back</button>
                                </div>

                                <div className="grid grid-cols-2 gap-1 rounded-sm bg-white/5 p-1 text-center font-semibold">
                                    {(["delivery", "pickup"] as OrderType[]).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setOrderType(t)}
                                            className={`rounded-sm py-1 capitalize transition-colors ${orderType === t ? "bg-[#e4202b] text-white" : "text-neutral-200 hover:text-white"}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Your Full Name *"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                    className="w-full rounded-sm bg-white/10 px-3 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#e4202b]"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    required
                                    className="w-full rounded-sm bg-white/10 px-3 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#e4202b]"
                                />

                                {orderType === "delivery" && (
                                    <input
                                        type="text"
                                        placeholder="Delivery Address *"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                        className="w-full rounded-sm bg-white/10 px-3 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#e4202b]"
                                    />
                                )}

                                {/* Scheduled date & time picker fields (kept behind feature flag to easily re-enable) */}
                                {ENABLE_SCHEDULED_SLOTS && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full rounded-sm bg-white/10 px-2 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#e4202b]"
                                        />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full rounded-sm bg-white/10 px-2 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#e4202b]"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        className="w-auto rounded-sm bg-[#e4202b] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#c81b24] active:scale-[0.98]"
                                    >
                                        Submit Order (${totalPrice.toFixed(2)})
                                    </button>
                                </div>
                            </form>
                        )}

                        {view === "success" && (
                            <div className="py-2 space-y-3">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <h3 className={`${displayFont.className} text-base uppercase text-white`}>Order Placed!</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setExpanded(false);
                                            setView("cart");
                                        }}
                                        className="text-xs text-neutral-300 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="py-2 text-center space-y-3">
                                    <svg className="mx-auto h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-xs text-neutral-200">
                                        Thank you {customerName}! We have received your order and will contact you shortly at {customerPhone}.
                                    </p>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExpanded(false);
                                                setView("cart");
                                            }}
                                            className="text-xs font-semibold uppercase text-white underline underline-offset-4 hover:text-[#e4202b]"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
