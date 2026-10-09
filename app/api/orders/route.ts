import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            items,
            orderType,
            date,
            time,
            location,
            customerName,
            customerPhone,
            totalPrice,
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart items are required." },
                { status: 400 }
            );
        }

        if (!customerName || !customerPhone) {
            return NextResponse.json(
                { error: "Customer name and phone number are required." },
                { status: 400 }
            );
        }

        const orderDoc = {
            items,
            orderType: orderType || "delivery",
            date: date || "",
            time: time || "",
            location: location || "",
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            totalPrice: Number(totalPrice) || 0,
            status: "pending", // pending, completed, cancelled
            createdAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("orders").add(orderDoc);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: "Order placed successfully.",
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Internal server error while placing order." },
            { status: 500 }
        );
    }
}
