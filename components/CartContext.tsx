"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

export type CartItem = {
    name: string;
    price: string;
    qty: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: { name: string; price: string }) => void;
    updateQty: (name: string, delta: number) => void;
    removeItem: (name: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    justAdded: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "bnb_cart";

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

function parsePrice(price: string | number): number {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return parseFloat(price.toString().replace("$", ""));
}

function loadCartFromStorage(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {
        // ignore parse errors
    }
    return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const isHydrated = useRef(false);

    useEffect(() => {
        const stored = loadCartFromStorage();
        if (stored.length > 0) {
            setCart(stored);
        }
        isHydrated.current = true;
    }, []);

    useEffect(() => {
        if (!isHydrated.current) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch {
            // ignore storage errors
        }
    }, [cart]);

    const totalItems = cart.reduce((sum, ci) => sum + ci.qty, 0);
    const totalPrice = cart.reduce(
        (sum, ci) => sum + ci.qty * parsePrice(ci.price),
        0
    );

    function addToCart(item: { name: string; price: string | number }) {
        const priceStr = typeof item.price === "number" ? `$${item.price}` : (item.price.startsWith("$") ? item.price : `$${item.price}`);
        setCart((prev) => {
            const existing = prev.find((ci) => ci.name === item.name);
            if (existing) {
                return prev.map((ci) =>
                    ci.name === item.name ? { ...ci, qty: ci.qty + 1 } : ci
                );
            }
            return [...prev, { name: item.name, price: priceStr, qty: 1 }];
        });
        setJustAdded(item.name);
        setTimeout(() => setJustAdded(null), 700);
    }

    function updateQty(name: string, delta: number) {
        setCart((prev) =>
            prev
                .map((ci) =>
                    ci.name === name ? { ...ci, qty: ci.qty + delta } : ci
                )
                .filter((ci) => ci.qty > 0)
        );
    }

    function removeItem(name: string) {
        setCart((prev) => prev.filter((ci) => ci.name !== name));
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQty,
                removeItem,
                clearCart,
                totalItems,
                totalPrice,
                justAdded,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
