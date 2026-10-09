"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Anton, Montserrat } from "next/font/google";
import { useCart } from "./CartContext";

const displayFont = Anton({ subsets: ["latin"], weight: "400" });
const bodyFont = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type OrderType = "delivery" | "pickup" | "dinein";

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
            const initialX = Math.max(16, window.innerWidth - 360);
            setPosition({
                x: initialX,
                y: 100,
            });
        }
    }, [position]);

    const clamp = useCallback(
        (x: number, y: number) => {
            const el = containerRef.current;
            const w = el ? el.offsetWidth : 320;
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
                    orderType,
                    date,
                    time,
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
        <div
            ref={containerRef}
            style={
                position
                    ? { left: position.x, top: position.y, position: "fixed", zIndex: 9999 }
                    : { right: 16, top: 100, position: "fixed", zIndex: 9999 }
            }
            className={`${bodyFont.className} select-none transition-shadow duration-300`}
        >
            {/* Floating Pill Trigger */}
            <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onClick={handleHeaderClick}
                className="group flex cursor-grab active:cursor-grabbing items-center gap-3 rounded-full bg-[#0a0a0a] px-5 py-3 text-white shadow-2xl ring-2 ring-[#FF8A3D]/40 transition-all hover:ring-[#FF8A3D]"
            >
                <div className="relative flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#FF8A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF8A3D] text-xs font-bold text-black">
                            {totalItems}
                        </span>
                    )}
                </div>

                <div className="flex flex-col text-left">
                    <span className={`${displayFont.className} text-base tracking-wider uppercase text-white`}>
                        {totalItems > 0 ? `${totalItems} Items` : "Cart Empty"}
                    </span>
                    {totalItems > 0 && (
                        <span className="text-xs text-[#FF8A3D] font-bold">
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
                    className="ml-2 rounded-full p-1 text-neutral-400 hover:text-white"
                >
                    <svg className={`h-4 w-4 transform transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Cart Modal Dropdown */}
            {expanded && (
                <div
                    data-no-drag
                    className="mt-3 w-80 max-w-[90vw] rounded-xl bg-[#121212] p-4 text-white shadow-2xl ring-1 ring-white/10"
                >
                    {view === "cart" && (
                        <div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h3 className={`${displayFont.className} text-lg uppercase tracking-wider text-[#FF8A3D]`}>Your BBQ Order</h3>
                                <button
                                    onClick={() => setExpanded(false)}
                                    className="text-xs text-neutral-400 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <p className="py-6 text-center text-sm text-neutral-400">Your cart is empty.</p>
                            ) : (
                                <div className="mt-3 max-h-60 overflow-y-auto space-y-3 pr-1">
                                    {cart.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-sm">
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-xs text-[#FF8A3D]">{item.price}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQty(item.name, -1)}
                                                    className="h-6 w-6 rounded bg-white/10 text-center font-bold text-white hover:bg-white/20"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center text-xs font-bold">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.name, 1)}
                                                    className="h-6 w-6 rounded bg-white/10 text-center font-bold text-white hover:bg-white/20"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.name)}
                                                    className="ml-1 text-red-400 hover:text-red-300"
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
                                    <div className="flex justify-between font-bold text-sm mb-3">
                                        <span>Total:</span>
                                        <span className="text-[#FF8A3D]">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => setView("checkout")}
                                        className="w-full rounded bg-[#FF8A3D] py-2.5 font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#e0762a]"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {view === "checkout" && (
                        <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <h3 className={`${displayFont.className} text-base uppercase text-[#FF8A3D]`}>Checkout</h3>
                                <button type="button" onClick={() => setView("cart")} className="text-neutral-400 hover:text-white">Back</button>
                            </div>

                            <div className="grid grid-cols-3 gap-1 rounded bg-white/5 p-1 text-center font-semibold">
                                {(["delivery", "pickup", "dinein"] as OrderType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setOrderType(t)}
                                        className={`rounded py-1 capitalize ${orderType === t ? "bg-[#FF8A3D] text-black" : "text-neutral-300"}`}
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
                                className="w-full rounded bg-white/10 px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                            />

                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                required
                                className="w-full rounded bg-white/10 px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                            />

                            {orderType === "delivery" && (
                                <input
                                    type="text"
                                    placeholder="Delivery Address *"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                    className="w-full rounded bg-white/10 px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                                />
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded bg-white/10 px-2 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                                />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full rounded bg-white/10 px-2 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full rounded bg-[#FF8A3D] py-2.5 font-bold uppercase tracking-wider text-black hover:bg-[#e0762a]"
                            >
                                Submit Order (${totalPrice.toFixed(2)})
                            </button>
                        </form>
                    )}

                    {view === "success" && (
                        <div className="py-4 text-center space-y-3">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                                ✓
                            </div>
                            <h3 className={`${displayFont.className} text-lg text-white uppercase`}>Order Placed!</h3>
                            <p className="text-xs text-neutral-300">
                                Thank you {customerName}! We have received your order and will contact you shortly at {customerPhone}.
                            </p>
                            <button
                                onClick={() => {
                                    setExpanded(false);
                                    setView("cart");
                                }}
                                className="w-full rounded bg-[#FF8A3D] py-2 text-xs font-bold uppercase text-black"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
